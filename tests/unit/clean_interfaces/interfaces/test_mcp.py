"""Tests for MCP interface implementation."""

from typing import Protocol, cast
from unittest.mock import MagicMock, patch

import pytest
from fastmcp import FastMCP

from clean_interfaces.interfaces.base import BaseInterface
from clean_interfaces.interfaces.mcp import MCPInterface


class _ToolRegistry(Protocol):
    """Typed subset of FastMCP used by these tests."""

    async def get_tool(self, name: str) -> object | None:
        """Return a registered MCP tool."""
        ...


class TestMCPInterface:
    """Test MCP interface functionality."""

    def test_mcp_interface_inherits_base(self) -> None:
        """Test that MCPInterface inherits from BaseInterface."""
        assert issubclass(MCPInterface, BaseInterface)

    def test_mcp_interface_has_name(self) -> None:
        """Test that MCPInterface has correct name."""
        mcp = MCPInterface()
        assert mcp.name == "MCP"

    def test_mcp_interface_has_fastmcp_app(self) -> None:
        """Test that MCPInterface has FastMCP app."""
        mcp = MCPInterface()
        assert hasattr(mcp, "mcp")
        assert isinstance(mcp.mcp, FastMCP)

    @pytest.mark.asyncio  # pyright: ignore [reportUnknownMemberType, reportUntypedFunctionDecorator, reportAttributeAccessIssue]
    async def test_mcp_welcome_command(self) -> None:
        """Test MCP welcome command functionality."""
        mcp = MCPInterface()
        tool = await cast("_ToolRegistry", mcp.mcp).get_tool("welcome")
        assert tool is not None

    @patch("fastmcp.FastMCP.run")
    def test_mcp_run_method(self, mock_run: MagicMock) -> None:
        """Test MCP run method executes fastmcp app."""
        mcp = MCPInterface()
        mcp.run()
        mock_run.assert_called_once()
