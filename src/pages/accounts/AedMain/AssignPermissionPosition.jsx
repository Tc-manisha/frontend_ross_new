import React, { useEffect, useState } from "react";
import DataGrid, {
  Column,
  Paging,
} from "devextreme-react/data-grid";
import {
  Form,
  Button as BButton,
  Button as BsButton,
  InputGroup,
} from "react-bootstrap";
import { Box } from '@mui/material'
import { CallGETAPI, CallPOSTAPI } from "../../../helper/API";
import { toast } from 'react-toastify';
import UpdateRoleToPositionModal from "./UpdateRoleToPositionModal";
import { FormatDate } from "../../../helper/Common";
import EditRoleToPositionModal from "./EditRoleToPositionModal";
import { sortArrAscending } from "../../../helper/constants";
import SearchBarComp from "./SearchBarComp";

const AssignPermissionPosition = () => {

  const [positions, setPositions] = useState([])

  const [roles, setRoles] = useState([])

  const [loading, setLoading] = useState(false)
  const [positionId, setPositionId] = useState('')
  const [active, setActive] = useState('')
  const [updateModal, setUpdateModal] = useState(false);

  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [assignPermissions, setAssignPermissions] = useState([])

  const [sortedPermissionsList, setSortedPermissionsList] = useState([])

  const [searchValue, setSearchValue] = useState('')

  const [edit, setEdit] = useState(false);
  const [rowData, setRowData] = useState('')

  const [invalid, setInvalid] = useState({
    position: false,
    role: false
  })

  const fetchPositions = async () => {
    let response = await CallGETAPI('admin/fetch-position')
    if (response?.status) {
      let sortedArr = sortArrAscending(response?.data?.data, 'position_name')
      setPositions(sortedArr)
    }
  }

  const fetchRoles = async () => {
    let response = await CallGETAPI('admin/get-permission-group')
    if (response?.status) {
      let sortedArr = sortArrAscending(response?.data?.data, 'role_name')
      setRoles(sortedArr)
    }
  }

  const fetchAssignPermission = async () => {
    let response = await CallGETAPI('admin/fetch-assign-permission-position')
    if (response?.status) {
      // let sortedArr = sortArrAscending(response?.data?.data, 'position_name')
      setAssignPermissions(response?.data?.data)
    }
  }

  useEffect(() => {
    let sortedArr = sortArrAscending(assignPermissions, 'position_name')
    setSortedPermissionsList(sortedArr)
  }, [assignPermissions])

  useEffect(() => {
    fetchPositions()
    fetchRoles()
    fetchAssignPermission()
  }, [])

  const fillRolesDD = () => {
    return roles?.map((item => {
      if (item.is_admin_role === 0) {
        return <option value={item?.role_id} >{item?.role_name}</option>
      }
    }))
  }

  const fillPositionsDD = () => {
    return positions?.map((item => {
      return <option value={item?.position_id} >{item?.position_name}</option>
    }))
  }

  const handleSubmit = async () => {

    let errors = {}

    if (selectedPosition === '') {
      errors.position = true
    }
    if (selectedRole === '') {
      errors.role = true
    }

    if (Object.keys(errors).length > 0) {
      setInvalid({ ...invalid, ...errors })
      return
    }

    setLoading(true)
    let body = { 'position_id': selectedPosition, 'role_id': selectedRole }
    let response = await CallPOSTAPI('admin/assign-permission-position', body)

    if (response?.status) {
      fetchPositions()
      fetchAssignPermission()
      setSelectedRole('')
      setSelectedPosition('')
      setLoading(false)
      toast.success('Role assigned successfully.')
    }
    else {
      setSelectedRole('')
      setLoading(false)
      toast.success('Something went wrong.')
    }
  }

  const handleUpdate = async (data) => {
    setActive(data?.data?.active)
    setPositionId(data?.data?.position_id)
    setUpdateModal(true)
  }

  const renderActions = (data) => {
    return (
      <div style={{ display: "flex", gap: '1%' }}>
        <div>
          {data && data?.data.active === 1 ?
            <button onClick={() => handleUpdate(data)} type="button" style={{ width: 100, height: "30px", background: "#d32f2f", border: "none", color: 'white', borderRadius: 12 }}>Deactivate</button>
            :
            <button onClick={() => handleUpdate(data)} type="button" style={{ width: 100, height: "30px", border: "none", background: 'green', color: 'white', borderRadius: 12 }}>Activate</button>
          }
        </div>
        <button
          className="text-primary"
          type="button"
          onClick={() => {
            setEdit(true);
            setRowData(data.data);
          }}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            border: "none",
            background: "transparent",
          }}
        >
          <img
            src="/edit.svg"
            alt="svg"
            style={{ marginRight: "0px" }}
          />
          <span className="ms-2">Edit</span>
        </button>
      </div>
    )
  }

  const renderStatus = (data) => {
    return (
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "7px" }}>
        {data && data?.data.active == 1 ?
          <p style={{ color: 'green' }}>Active</p>
          :
          <p style={{ color: '#d32f2f' }}>Deactivated</p>
        }
      </div >
    )
  }

  return (
    <>
      <div
        className="mt-4"
        style={{ position: "relative", width: "100%", paddingInline: "45px", marginBottom: '4%' }}
      >
        <Box className="text-left pt-3 pb-1">
          <h4 className="heading">Assign Role to Position</h4>
        </Box>

        {/* Form to assign Role to Position */}
        <div className="my-4"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "5%",
            marginBottom: "50px",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", flexDirection: "row", width: "70%", gap: "5%" }}>
            <div>
              <Form.Group className={"col"} style={{ width: 300 }}>
                <Form.Label>Select Position*</Form.Label>
                <select
                  style={{ borderColor: invalid.position ? '#DC3545' : '' }}
                  className="form-control"
                  value={selectedPosition}
                  name="contractYear"
                  placeholder="Enter Role Name"
                  onChange={(e) => {
                    setSelectedPosition(e.target.value)
                    setInvalid({ ...invalid, position: false })
                  }}
                >
                  <option value="" >--Select One--</option>
                  {fillPositionsDD()}
                </select>
              </Form.Group>
              {invalid.position && (
                <p style={{ color: '#DC3545' }}>Please select position</p>
              )}
            </div>

            <div>
              <Form.Group className={"col"} style={{ width: 300 }}>
                <Form.Label>Select Role*</Form.Label>
                <select
                  style={{ borderColor: invalid.role ? '#DC3545' : '' }}
                  className="form-control"
                  value={selectedRole}
                  name="contractYear"
                  placeholder="Enter Role Name"
                  onChange={(e) => {
                    setSelectedRole(e.target.value)
                    setInvalid({ ...invalid, role: false })
                  }}
                >
                  <option value="" >--Select One--</option>
                  {fillRolesDD()}
                </select>
              </Form.Group>
              {invalid.role && (
                <p style={{ color: '#DC3545' }}>Please select role</p>
              )}
            </div>

            <button
              className="btn btn-success text-uppercase ms-2"
              type="submit"
              style={{ marginTop: 25, height: 40 }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Submit'}
            </button>
          </div>
        </div>


        <div style={{ display: 'flex', justifyContent: 'right' }}>
          <SearchBarComp
            tableData={assignPermissions}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            setsortedTableData={setSortedPermissionsList}
            key1='position_name'
            key2='role_name'
            sortingKey='position_name'
          />
        </div>
        <DataGrid
          className="my-2"
          id=""
          dataSource={sortedPermissionsList}
          keyExpr=""
          showBorders={true}
          // height={ 500 }
          showRowLines={true}
          columnAutoWidth={true}
          wordWrapEnabled={true}
        >
          <Paging defaultPageSize={10} defaultPageIndex={0} />

          <Column
            dataField="position_name"
            caption={"Position Name"}
            dataType="string"
          />
          <Column
            dataField="role_name"
            caption={"Role"}
            dataType="string"
          //   cellRender={(e) => RenderEqupment(e.data)}
          // allowSorting={false}
          />
          {/* <Column
            // dataField="modify_date"
            caption={"Assign Date"}
            cellRender={(data) => renderAssignDate(data)}
            dataType="string"
          /> */}
          <Column
            caption={"Status"}
            cellRender={(data) => renderStatus(data)}
            dataType="string"
            allowSorting={true}
          />
          <Column
            style={{ maxWidth: 200 }}
            caption={"Actions"}
            cellRender={(data) => renderActions(data)}
            dataType="string"
            allowSorting={true}
          />
        </DataGrid>

        <UpdateRoleToPositionModal updateModal={updateModal} setUpdateModal={setUpdateModal} positionId={positionId} active={active} fetchAssignPermission={fetchAssignPermission} />

        {edit && (
          <EditRoleToPositionModal
            show={edit}
            setShow={setEdit}
            rowData={rowData}
            fillRolesDD={fillRolesDD}
            fillPositionsDD={fillPositionsDD}
            fetchAssignPermission={fetchAssignPermission}
          />
        )}
      </div>
    </>
  );
};

export default AssignPermissionPosition;
