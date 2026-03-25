# Database Management Best Practices

## Overview
This document outlines the database management practices for the Smart Expert Mental Health Support System to ensure data security, version control compliance, and proper development workflow.

## Database Files and Version Control

### ❌ NEVER COMMIT TO VERSION CONTROL
- `backend/db.sqlite3` - Database files
- `backend/db.sqlite3-journal` - SQLite journal files
- `backend/media/*` - User uploaded files (images, documents)
- Any production database files

### ✅ COMMIT TO VERSION CONTROL
- Migration files (`backend/core/migrations/*.py`)
- Fixture files (`backend/core/fixtures/*.json`)
- Model definitions (`backend/core/models.py`)
- Seed scripts (`backend/core/management/commands/*.py`)

## Development Workflow

### 1. Database Setup
```bash
# Create fresh database
python manage.py migrate

# Load initial data (fixtures)
python manage.py loaddata initial_data.json

# OR run seed command
python manage.py seed_data
```

### 2. Making Schema Changes
```bash
# Create migration after model changes
python manage.py makemigrations

# Apply migration
python manage.py migrate
```

### 3. Data Management
```bash
# Create backup of current data
python manage.py dumpdata core > backup.json

# Load specific fixture
python manage.py loaddata fixture_name.json

# Run custom seed command
python manage.py seed_data
```

## Environment Separation

### Development Environment
- Uses `backend/db.sqlite3` (local file)
- Contains test/sample data
- Can be reset and recreated as needed

### Production Environment
- Uses PostgreSQL/MySQL (configured via environment variables)
- Contains real user data
- Requires proper backups and migration procedures

## Security Considerations

### Sensitive Data Protection
1. **Never commit database files** containing user data
2. **Use environment variables** for database credentials
3. **Implement proper access controls** on production databases
4. **Regular security audits** of database access logs

### Backup Strategy
1. **Daily automated backups** for production
2. **Manual backups** before major deployments
3. **Store backups securely** (encrypted, access-controlled)
4. **Test restore procedures** regularly

## Data Seeding

### Fixtures vs Seed Commands
- **Fixtures** (`*.json`): Static initial data (countries, specialties)
- **Seed Commands** (`*.py`): Dynamic data generation (sample therapists, reviews)

### Available Commands
```bash
# Load static fixtures
python manage.py loaddata initial_data.json

# Run comprehensive seed
python manage.py seed_data

# Create custom fixtures
python manage.py dumpdata core.model_name > custom_fixture.json
```

## Troubleshooting

### Common Issues
1. **Database locked**: Close all connections and retry
2. **Migration conflicts**: Resolve with `python manage.py migrate --fake`
3. **Corrupted database**: Delete and recreate from fixtures/seeds

### Recovery Procedures
1. **Identify the issue** through error logs
2. **Restore from backup** if data corruption
3. **Recreate database** if structure is damaged
4. **Verify data integrity** after recovery

## Best Practices Summary

1. ✅ **Always use migrations** for schema changes
2. ✅ **Never commit database files** to version control
3. ✅ **Use fixtures for static data**, seed commands for dynamic data
4. ✅ **Separate development and production** databases
5. ✅ **Implement proper backup strategies**
6. ✅ **Document any custom data procedures**
7. ✅ **Test migration procedures** in development first

## Git Configuration

The `.gitignore` file is configured to exclude:
- All SQLite database files
- Database journal files
- Media uploads (except directory structure)
- Environment-specific files

This ensures that only schema changes and code are tracked, not actual data.
