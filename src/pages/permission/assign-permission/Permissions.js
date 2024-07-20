import * as React from 'react';
import { useState, useEffect } from 'react';
import { CallGETAPI } from '../../../helper/API';
import Select, { components } from 'react-select';

export default function Permissions({
    position,
    setPosition,
    setPermissionsArray,
    setIsInvalid,
    isInvalid
}) {

    const [permissions, setPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([])

    const fetchPermissions = async () => {
        let response = await CallGETAPI('admin/get-permission')
        if (response?.status) {
            setPermissions(response?.data?.data)
        }
    }

    useEffect(() => {
        fetchPermissions()
    }, [])

    // useEffect(() => {
    //     setPosition(position?.permission_group || '');
    // }, [position]);

    const permissionsNameArr = permissions.map(item => ({
        value: item?.pr_id,
        label: item?.permissions
    }));

    const handleChange = (selectedOptions) => {
        setIsInvalid({ ...isInvalid, permission_group: false });
        let permissionsArr = selectedOptions.map(item => item.value);
        setSelectedPermissions(selectedOptions);
        if (setPosition) {
            setPosition({ ...position, permission_group: permissionsArr + "" })
        }
        if (setPermissionsArray) {
            setPermissionsArray(permissionsArr)
        }
    };

    const customOption = ({ children, ...props }) => (
        <components.Option {...props}>
            <input
                style={{ marginRight: '3%' }}
                type="checkbox"
                checked={selectedPermissions.some(option => option.value === props.value)}
                onChange={() => handleOptionToggle(props)}
            />
            {children}
        </components.Option>
    );

    const handleOptionToggle = option => {
        const selectedOptionIndex = selectedPermissions.findIndex(
            item => item.value === option.value
        );
        if (selectedOptionIndex > -1) {
            const updatedOptions = [...selectedPermissions];
            updatedOptions.splice(selectedOptionIndex, 1);
            setSelectedPermissions(updatedOptions);
        } else {
            setSelectedPermissions([...selectedPermissions, option]);
        }
    };

    const assignPermissions = () => {
        return (
            <div>
                <Select
                    value={selectedPermissions}
                    isMulti
                    options={permissionsNameArr}
                    onChange={(e) => handleChange(e)}
                    components={{ Option: customOption }}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    styles={{
                        control: (provided, state) => ({
                            ...provided,
                            borderColor: isInvalid?.permission_group ? '#DC3545' : 'gainsboro',
                        }),
                    }}
                />
                {
                    isInvalid?.permission_group ?
                        <p style={{ color: '#DC3545', fontWeight: 400, fontSize: 14, marginTop: 5 }}>Please select Permission groups</p>
                        :
                        <></>
                }
            </div>
        )
    }

    return (
        <div>
            {assignPermissions()}
        </div>
    );
}