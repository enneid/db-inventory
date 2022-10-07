import alembic.config
alembicArgs = [
    '--raiseerr',
    'revision', '--message', 'change_me',
]
alembic.config.main(argv=alembicArgs)