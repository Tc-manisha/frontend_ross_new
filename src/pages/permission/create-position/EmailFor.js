import * as React from 'react';
import { useState, useEffect } from 'react';
import Select, { components } from 'react-select';

export default function EmailFor({
    setPosition,
    position,
    setIsInvalid,
    isInvalid
}) {

    const [selectedPermissions, setSelectedPermissions] = useState([])

    const emailPermissions = [
        {
            permission_name: '30',
            permission_id: 2
        },
        {
            permission_name: '60',
            permission_id: 3
        },
        {
            permission_name: '90',
            permission_id: 4
        },
        {
            permission_name: 'Checks',
            permission_id: 5
        },
        {
            permission_name: 'Servicing',
            permission_id: 6
        },
        {
            permission_name: 'RMS',
            permission_id: 7
        }
    ]

    const permissionsNameArr = emailPermissions.map(item => ({
        value: item?.permission_id,
        label: item?.permission_name
    }));

    const handleChange = (selectedOptions) => {
        setIsInvalid({ ...isInvalid, permissions: false });
        let permissionsArr = selectedOptions.map(item => item.value);
        setSelectedPermissions(selectedOptions);
        if (setPosition) {
            setPosition({ ...position, permissions: permissionsArr + "" })
        }
    };

    // useEffect(() => {
    //     setPosition(position?.permissions || '');
    // }, [position]);

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
                    className="basic-multi-select"
                    classNamePrefix="select"
                    value={selectedPermissions}
                    isMulti
                    components={{ Option: customOption }}
                    options={permissionsNameArr}
                    onChange={(e) => handleChange(e)}
                    styles={{
                        control: (provided, state) => ({
                            ...provided,
                            borderColor: isInvalid?.permissions ? '#DC3545' : 'gainsboro',
                            // Add other control styles here if needed
                        }),
                    }}
                />
                {
                    isInvalid?.permissions ?
                        <p style={{ color: '#DC3545', fontWeight: 400, fontSize: 14, marginTop: 5 }}>Please select Permissions</p>
                        :
                        <></>
                }
            </div>
        );
    }

    return (
        <div>
            {assignPermissions()}
        </div>
    )

}