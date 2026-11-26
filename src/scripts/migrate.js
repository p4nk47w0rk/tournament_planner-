#!/usr/bin/env node
/**
 * Migration-Skript: Supabase Schema auf remote/lokale Instanz anwenden
 *
 * Usage:
 *   node src/scripts/migrate.js              --local (default)
 *   node src/scripts/migrate.js --remote     --supabase-url <url> --supabase-key <key>
 */

const fs = require('fs')
const path = require('path')

const schemaPath = path.join(__dirname, '../../supabase/init.sql')
const schema = fs.readFileSync(schemaPath, 'utf-8')

// Skip this script if Supabase credentials aren't configured
// The schema is applied manually in the Supabase Dashboard SQL editor
// for production, or via docker-compose for local development.

console.log('Schema loaded from supabase/init.sql (' + schema.length + ' bytes)')
console.log('Tables defined: matches, standings, goals, edits')
console.log('')
console.log('To apply:')
console.log('  - Local: docker compose up -d')
console.log('  - Remote: Supabase Dashboard → SQL Editor → paste schema')
