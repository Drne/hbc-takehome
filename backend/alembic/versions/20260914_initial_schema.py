"""Initial schema.

Revision ID: 20260914_initial_schema
Revises: 
Create Date: 2026-09-14 13:59:22.726040
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "20260914_initial_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "products",
        sa.Column("ProductID", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("Name", sa.String(length=255), nullable=False),
        sa.Column("Price", sa.DECIMAL(precision=10, scale=2), nullable=False),
    )
    op.create_table(
        "employees",
        sa.Column("EmployeeID", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("FirstName", sa.String(length=255), nullable=False),
        sa.Column("MiddleInitial", sa.String(length=1), nullable=True),
        sa.Column("LastName", sa.String(length=255), nullable=False),
    )
    op.create_table(
        "customers",
        sa.Column("CustomerID", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("FirstName", sa.String(length=255), nullable=False),
        sa.Column("MiddleInitial", sa.String(length=1), nullable=True),
        sa.Column("LastName", sa.String(length=255), nullable=False),
    )
    op.create_table(
        "orders",
        sa.Column("OrderID", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("SalesPersonID", sa.Integer(), nullable=False),
        sa.Column("CustomerID", sa.Integer(), nullable=False),
        sa.Column("ProductID", sa.Integer(), nullable=False),
        sa.Column("Quantity", sa.Integer(), nullable=False, server_default="1"),
        sa.ForeignKeyConstraint(["SalesPersonID"], ["employees.EmployeeID"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["CustomerID"], ["customers.CustomerID"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["ProductID"], ["products.ProductID"], ondelete="CASCADE"),
    )


def downgrade() -> None:
    op.drop_table("orders")
    op.drop_table("customers")
    op.drop_table("employees")
    op.drop_table("products")
