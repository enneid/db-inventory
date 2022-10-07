"""initial

Revision ID: 72b00c124738
Revises: 
Create Date: 2022-10-05 20:00:26.304688

"""
from xmlrpc.client import Boolean
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '72b00c124738'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'departments',
        sa.Column('id', sa.Integer, primary_key=True, index=True),
        sa.Column('name', sa.String(50), nullable=False, index=True, unique=True),
        sa.Column('code', sa.String(50), nullable=False, index=True, unique=True),
        sa.Column('created_at', sa.DateTime, nullable=False, index=True),
        sa.Column('updated_at', sa.DateTime, nullable=False, index=True),
        sa.Column('jsondata', sa.JSON, nullable=False)
    )

    op.create_table(
        'users',
        sa.Column('id', sa.Integer, primary_key=True, index=True),
        sa.Column('username', sa.String(50), nullable=False, index=True, unique=True),
        sa.Column('role', sa.String(50), nullable=False,  index=True),
        sa.Column('encrypted_password', sa.String(100), nullable=False),
        sa.Column('department_id', sa.INTEGER, sa.ForeignKey('departments.id', ondelete='SET NULL'),index=True),
        sa.Column('active', sa.Boolean, nullable=False, index=True),
        sa.Column('created_at', sa.DateTime, nullable=False, index=True),
        sa.Column('updated_at', sa.DateTime, nullable=False, index=True),
        sa.Column('jsondata', sa.JSON, nullable=False)
    )


def downgrade() -> None:
    op.drop_table('departments')