import React from "react";
import DataGrid, {
	Column,
	FilterRow,
	HeaderFilter,
	FilterPanel,
	FilterBuilderPopup,
	Scrolling,
	SearchPanel,
	Paging,
} from "devextreme-react/data-grid";
import { orders } from "./data.js";
import
	{
		RenderEqupment,
		RenderSecure,
		RenderTraining,
	} from "../../helper/TblFn.js";
import { Link, useNavigate } from "react-router-dom";

const saleAmountEditorOptions = { format: "currency", showClearButton: true };

const UserAccountTbl = ({ tableData }) =>
{
	const navigate = useNavigate();

	const RenderAccTitle = (account) =>
	{
		return (
			<>
				<span
					role={ "button link" }
					style={ { color: "#0C71C3", fontWeight: 600, cursor: "pointer" } }
					onClick={ () =>
					{
						
						navigate(`/user/account-details/${ account?.account_id }`, {
							state: {
								siteTitle: "Account : " + account?.account_name,
								editUrl: "/account/accounts-edit/" + account?.account_id,
								deleteUrl: "/account/accounts-delete/" + account?.account_id,
							},
						});
					} }
				>
					{ account.account_name }
				</span>
			</>
		);
	};

	const RenderAccParent = (account) =>
	{
		return (
			<>
				<span
					role={ "button link" }
					style={ { color: "#0C71C3", fontWeight: 600, cursor: "pointer" } }
					onClick={ () =>
					{
						navigate(`/user/account-details/${ account?.parent_account_id }`, {
							state: {
								siteTitle: "Account : " + account?.parent_name,
								editUrl: "/account/accounts-edit/" + account?.parent_account_id,
								deleteUrl:
									"/account/accounts-delete/" + account?.parent_account_id,
							},
						});
					} }
				>
					{ account.parent_name }
				</span>
			</>
		);
	};
	const RenderDistributer = (account) =>
	{
		return (
			<>
				<span
					role={ "button link" }
					style={ { color: "#0C71C3", fontWeight: 600, cursor: "pointer" } }
					onClick={ () =>
					{
						navigate(`/user/account-details/${ account?.distributor_id }`, {
							state: {
								siteTitle: "Account : " + account?.distributon_name,
								editUrl: "/account/accounts-edit/" + account?.distributor_id,
								deleteUrl:
									"/account/accounts-delete/" + account?.distributor_id,
							},
						});
					} }
				>
					{ account.distributon_name }
				</span>
			</>
		);
	};
	return (
		<>
			<DataGrid
				id="account-listing-table"
				dataSource={ tableData }
				keyExpr="account_id"
				showBorders={ true }
				// height={ 500 }
				showRowLines={ true }
				columnAutoWidth={ true }
				wordWrapEnabled={ true }
			>
				<SearchPanel
					visible={ true }
					highlightCaseSensitive={ true }
					placeholder="Search by keywords..."
				/>

				<Paging defaultPageSize={ 25 } defaultPageIndex={ 0 } />

				<Column
					dataField="account_name"
					caption={ "Accounts" }
					dataType="string"
					cellRender={ (e) => RenderAccTitle(e.data) }
				/>
				<Column
					dataField="equipment"
					caption={ "Equipment" }
					dataType="string"
					cellRender={ (e) => RenderEqupment(e.data) }
					allowSorting={ false }
				/>
				<Column
					dataField="Trainning"
					dataType="string"
					cellRender={ (e) => RenderTraining(e.data) }
					allowSorting={ false }
				/>
				<Column
					dataField="customer_type_name"
					caption={ "Customer Type" }
					dataType="string"
				/>
				<Column
					dataField="parent_name"
					caption={ "Parent" }
					cellRender={ (e) => RenderAccParent(e.data) }
					dataType="string"
				/>
				<Column
					dataField="distributon_name"
					caption={ "Distributor" }
					dataType="string"
					cellRender={ (e) => RenderDistributer(e.data) }
				/>
				<Column dataField="owner" dataType="string" caption={ "Owner" } />
				<Column
					dataField="isSecure"
					dataType="string"
					caption={ "Restricted" }
					cellRender={ (e) => RenderSecure(e.data) }
					allowSorting={ false }
				/>
			</DataGrid>
		</>
	);
};

function getOrderDay(rowData)
{
	return new Date(rowData.OrderDate).getDay();
}

const filterBuilderPopupPosition = {
	of: window,
	at: "top",
	my: "top",
	offset: { y: 10 },
};

const filterBuilder = {
	customOperations: [
		{
			name: "weekends",
			caption: "Weekends",
			dataTypes: [ "date" ],
			icon: "check",
			hasValue: false,
			calculateFilterExpression: () => [
				[ getOrderDay, "=", 0 ],
				"or",
				[ getOrderDay, "=", 6 ],
			],
		},
	],
	allowHierarchicalFields: true,
};

const filterValue = [
	[ "Employee", "=", "Clark Morgan" ],
	"and",
	[ "OrderDate", "weekends" ],
];

const saleAmountHeaderFilters = [
	{
		text: "Less than $3000",
		value: [ "SaleAmount", "<", 3000 ],
	},
	{
		text: "$3000 - $5000",
		value: [
			[ "SaleAmount", ">=", 3000 ],
			[ "SaleAmount", "<", 5000 ],
		],
	},
	{
		text: "$5000 - $10000",
		value: [
			[ "SaleAmount", ">=", 5000 ],
			[ "SaleAmount", "<", 10000 ],
		],
	},
	{
		text: "$10000 - $20000",
		value: [
			[ "SaleAmount", ">=", 10000 ],
			[ "SaleAmount", "<", 20000 ],
		],
	},
	{
		text: "Greater than $20000",
		value: [ "SaleAmount", ">=", 20000 ],
	},
];

export default UserAccountTbl;
