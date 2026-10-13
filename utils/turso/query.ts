import type { Client, InStatement, Transaction } from '@libsql/client';



type Executor = Pick<Client, 'execute' | 'batch'>;
const quote = (name: string) => {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) throw new Error('Invalid database identifier');
  return `"${name}"`;
};
const tableName = (name: string) => name;
const columnName = (table: string, name: string) => table === 'user' && name === 'nama' ? 'name' : name;
const value = (v: any): any => v instanceof Date ? v.toISOString() : typeof v === 'boolean' ? Number(v) : v && typeof v === 'object' ? JSON.stringify(v) : v ?? null;
const parseRow = (row: any, table: string) => {
  const result: any = { ...row };
  for (const key of ['metadata', 'landing_page_config', 'events', 'payload', 'headers']) {
    if (typeof result[key] === 'string') { try { result[key] = JSON.parse(result[key]); } catch {} }
  }
  for(const k of ['is_active','is_default','has_rawatib','has_dzikir','is_prayer_5_times']) if(k in result)result[k]=Boolean(result[k]);
  if(typeof result.attendee_child_ids==='string')result.attendee_child_ids=JSON.parse(result.attendee_child_ids);
  if (table === 'user') result.nama = result.name;
  return result;
};

// Keep the existing server call shape while both Next.js and Worker use libSQL.
export class TursoQueryBuilder implements PromiseLike<any> {
  private table: string;
  private columns = '*';
  private filters: string[] = [];
  private args: any[] = [];
  private ordering = '';
  private offset = 0;
  private take: number | undefined;
  private operation = 'select';
  private rows: any[] = [];
  private returnRows = false;
  private exactCount = false;
  private conflict='id';
  constructor(private client: Executor, table: string, private userId: string) { this.table = tableName(table); quote(this.table); }
  select(columns = '*', options?: { count?: string; head?: boolean }) { this.columns = columns; this.returnRows = true; this.exactCount = options?.count === 'exact'; return this; }
  insert(rows: any) { this.operation = 'insert'; this.rows = Array.isArray(rows) ? rows : [rows]; return this; }
  upsert(rows: any, options?: {onConflict?:string}) { if(options?.onConflict){options.onConflict.split(',').forEach(quote);this.conflict=options.onConflict;}  this.operation = 'upsert'; this.rows = Array.isArray(rows) ? rows : [rows]; return this; }
  update(row: any) { this.operation = 'update'; this.rows = [row]; return this; }
  delete() { this.operation = 'delete'; return this; }
  private condition(column: string, op: string, v: any) {
    const col = quote(columnName(this.table, column));
    if (v == null) this.filters.push(`${col} IS ${op === '!=' ? 'NOT ' : ''}NULL`);
    else { this.filters.push(`${col} ${op} ?`); this.args.push(value(v)); }
    return this;
  }
  eq(c: string, v: any) { return this.condition(c, '=', v); }
  neq(c: string, v: any) { return this.condition(c, '!=', v); }
  is(c: string, v: any) { return this.eq(c, v); }
  gte(c: string, v: any) { return this.condition(c, '>=', v); }
  lte(c: string, v: any) { return this.condition(c, '<=', v); }
  ilike(c: string, v: any) { return this.condition(c, 'LIKE', v); }
  in(c: string, values: any[]) {
    this.filters.push(values.length ? `${quote(columnName(this.table, c))} IN (${values.map(() => '?').join(',')})` : '0 = 1');
    this.args.push(...values.map(value)); return this;
  }
  or(conditions: string) {
    const clauses = conditions.split(',').map(part => {
      const m = /^([A-Za-z_][A-Za-z0-9_]*)\.(eq|ilike)\.(.*)$/.exec(part.trim());
      if (!m) throw new Error('Unsupported OR filter');
      this.args.push(m[3]); return `${quote(columnName(this.table, m[1]))} ${m[2] === 'eq' ? '=' : 'LIKE'} ?`;
    });
    this.filters.push(`(${clauses.join(' OR ')})`); return this;
  }
  range(from: number, to: number) { this.offset = from; return this.limit(to - from + 1); }
  limit(n: number) { if (!Number.isInteger(n) || n < 0) throw new Error('Invalid limit'); this.take = n; return this; }
  order(c: string, options?: { ascending?: boolean }) { this.ordering = ` ORDER BY ${quote(columnName(this.table, c))} ${options?.ascending === false ? 'DESC' : 'ASC'}`; return this; }
  async single() { const r = await this.execute(); return { ...r, data: r.data?.length === 1 ? r.data[0] : null, error: r.error || (r.data?.length !== 1 ? { message: 'Expected one row' } : null) }; }
  async maybeSingle() { const r = await this.execute(); return { ...r, data: r.data?.[0] ?? null, error: r.error || (r.data?.length > 1 ? { message: 'Expected at most one row' } : null) }; }
  then<TResult1 = any, TResult2 = never>(yes?: ((v: any) => TResult1 | PromiseLike<TResult1>) | null, no?: ((v: any) => TResult2 | PromiseLike<TResult2>) | null): Promise<TResult1 | TResult2> { return this.execute().then(yes, no); }
  private async project(rows: any[]) {
    // Only the relations actually used by Stakku; never ignore an unknown join.
    const parts = this.columns.match(/[^,()]+\([^)]*\)|[^,()]+/g)?.map(p => p.trim()).filter(Boolean) || [];
    return Promise.all(rows.map(async row => {
      const out: any = parts.includes('*') ? { ...row } : {};
      for (const part of parts) {
        if (part === '*') continue;
        const join = /^(?:(\w+):)?(\w+)(?:!\w+)?\s*\((.*)\)$/s.exec(part);
        if (!join) { quote(part); out[part] = row[part === 'nama' && this.table === 'user' ? 'name' : part]; continue; }
        const [, alias, target, fields] = join;
        const relation = target==='spaces'?['space_id','id',false]:target==='children'?['child_id','id',false]:target==='activities'?['activity_id','id',false]:target==='rewards_pledges'?['pledge_id','id',false]:null;
        if (!relation) throw new Error(`Unsupported relation: ${target}`);
        const [local, foreign, many] = relation;
        const related = await new TursoQueryBuilder(this.client, target, this.userId).select(fields).eq(String(foreign), row[String(local)]);
        if (related.error) throw new Error(related.error.message);
        out[alias || target] = many ? related.data : related.data[0] ?? null;
      }
      return out;
    }));
  }
  private async execute(): Promise<any> {
    try {
      if(!this.userId)throw Error('Authentication required');
      const allowed=['profiles','spaces','space_members','children','categories','activities','activity_logs','rewards_pledges','rewards_ledger','class_sessions','media_assets'];if(!allowed.includes(this.table))throw Error('Unsupported table');
      const reward=this.table.startsWith('rewards_');
      const readOnly=this.operation==='select';
      const spaces=(await this.client.execute({sql:readOnly&&!reward?'SELECT id,space_type FROM spaces WHERE owner_id=? OR id IN (SELECT space_id FROM space_members WHERE user_id=?)':'SELECT id,space_type FROM spaces WHERE owner_id=?',args:readOnly&&!reward?[this.userId,this.userId]:[this.userId]})).rows;
      const ids=spaces.filter(s=>!reward||s.space_type==='family').map(s=>String(s.id));
      if(this.operation==='insert'||this.operation==='upsert')for(const row of this.rows){if(this.table==='spaces'){if(row.owner_id!==this.userId||!['family','classroom'].includes(row.space_type))throw Error('Invalid space owner')}else if(this.table==='profiles'){if(row.id!==this.userId)throw Error('Access denied')}else{if(!ids.includes(row.space_id))throw Error('Space access denied');if(this.table==='class_sessions'&&!spaces.some(s=>s.id===row.space_id&&s.space_type==='classroom'))throw Error('Classroom required');if(row.owner_id||row.user_id)throw Error('Membership changes are not supported');if(this.table==='class_sessions'){for(const child of row.attendee_child_ids||[]){const found=(await this.client.execute({sql:'SELECT id FROM children WHERE id=? AND space_id=?',args:[child,row.space_id]})).rows[0];if(!found)throw Error('Invalid attendee')}}}}
      if(this.operation==='upsert')for(const row of this.rows){if(row.id){const old=(await this.client.execute({sql:'SELECT space_id FROM '+quote(this.table)+' WHERE id=?',args:[row.id]})).rows[0];if(old&&old.space_id!==row.space_id)throw Error('Cannot move records')}}
      if(this.operation==='update'&&('space_id' in (this.rows[0]||{})||'owner_id' in (this.rows[0]||{})||'user_id' in (this.rows[0]||{})))throw Error('Cannot transfer ownership');
      const scopeColumn=this.table==='profiles'?'id':this.table==='spaces'?'id':'space_id';const scopeIds=this.table==='profiles'?[this.userId]:ids;
      if(this.operation!=='insert'&&this.operation!=='upsert'){this.filters.push(scopeIds.length?quote(scopeColumn)+' IN ('+scopeIds.map(()=>'?').join(',')+')':'0=1');this.args.push(...scopeIds)}
      const table = quote(this.table), where = this.filters.length ? ` WHERE ${this.filters.join(' AND ')}` : '';
      let rows: any[] = [], count: number | undefined;
      if (this.operation === 'insert' || this.operation === 'upsert') {
        const statements: InStatement[] = this.rows.map(input => {
          const row: any = { ...input, id: input.id || crypto.randomUUID() };
          if (this.table === 'user') {
            if ('nama' in row) { row.name = row.nama; delete row.nama; }
            if ('created_at' in row) { row.createdAt = Math.floor(Date.parse(row.created_at) / 1000); delete row.created_at; }
            if ('updated_at' in row) { row.updatedAt = Math.floor(Date.parse(row.updated_at) / 1000); delete row.updated_at; }
            row.createdAt ??= Math.floor(Date.now() / 1000); row.updatedAt ??= Math.floor(Date.now() / 1000);
          }
          const keys = Object.keys(row);
          const conflict = this.operation === 'upsert' ? ` ON CONFLICT(${this.conflict.split(',').map(quote).join(',')}) DO UPDATE SET ${keys.filter(k => k !== 'id').map(k => `${quote(k)}=excluded.${quote(k)}`).join(',')}` : '';
          return { sql: `INSERT INTO ${table} (${keys.map(quote).join(',')}) VALUES (${keys.map(() => '?').join(',')})${conflict} RETURNING *`, args: keys.map(k => value(row[k])) };
        });
        const results = await this.client.batch(statements, 'write');
        rows = results.flatMap(r => r.rows.map(row => parseRow(row, this.table)));
      } else if (this.operation === 'update' || this.operation === 'delete') {
        if (!where) throw new Error('A filter is required for update/delete');
        const entries = Object.entries(this.rows[0] || {});
        const set = entries.map(([k]) => `${quote(columnName(this.table, k))}=?`).join(',');
        const sql = this.operation === 'update' ? `UPDATE ${table} SET ${set}${where} RETURNING *` : `DELETE FROM ${table}${where} RETURNING *`;
        const result = await this.client.execute({ sql, args: [...(this.operation === 'update' ? entries.map(([,v]) => value(v)) : []), ...this.args] });
        rows = result.rows.map(row => parseRow(row, this.table));
      } else {
        if (this.exactCount) { const result = await this.client.execute({ sql: `SELECT COUNT(*) AS total FROM ${table}${where}`, args: this.args }); count = Number(result.rows[0].total); }
        const limit = this.take === undefined ? '' : ` LIMIT ${this.take} OFFSET ${this.offset}`;
        const result = await this.client.execute({ sql: `SELECT * FROM ${table}${where}${this.ordering}${limit}`, args: this.args });
        rows = result.rows.map(row => parseRow(row, this.table));
      }
      if(['update','delete'].includes(this.operation)&&!rows.length)throw Error('Record missing or access denied');
      return { data: this.operation === 'select' || this.returnRows ? await this.project(rows) : null, count: count ?? rows.length, error: null };
    } catch (error: any) { return { data: null, count: 0, error: { message: error.message } }; }
  }
}

