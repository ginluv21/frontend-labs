import { DatabaseSync } from 'node:sqlite'
import { mkdirSync, readFileSync } from 'node:fs'

export function openLocalDatabase() {
  mkdirSync('.data', { recursive: true })
  const db = new DatabaseSync('.data/saved.sqlite')
  db.exec(readFileSync('drizzle/0000_saved_advice.sql', 'utf8'))
  return {
    prepare(sql) {
      const statement = db.prepare(sql)
      return {
        all: () => ({ results: statement.all() }),
        bind: (...values) => ({ run: () => statement.run(...values) }),
      }
    },
    close: () => db.close(),
  }
}
