import React, { useEffect } from 'react'
import Select from 'react-select'
import { Form } from "react-bootstrap";
import { useState } from 'react';
import { GetAedBrands, GetAedModelsByBrandId } from '../../../helper/BasicFn';
import { prepareOptions } from '../../../helper/Common';

export default function AedComponent({aedData, setAedData, mode}) {

    const [rowsData, setRowsData] = useState([
        {
            model: {},
            brand: {},
        }
    ]);

    const [brands, setBrands] = useState({});
    const [models, setModels] = useState({});

    // handle address change
    const handleSelectChange = (index, data, key) =>
    {
        const rowsInput = [...rowsData];
        rowsInput[index][key] = data;
        setRowsData(rowsInput);
        setAedData(rowsInput);
        // setFormData((old) => ({ ...old, [ key ]: data.value }));

    };

    // handle address change
    const fetchModelsByBrand = async(index, data) =>
     { 

        const models = await GetAedModelsByBrandId(data?.value)

        if(models?.status) {
            const modelsData = models?.data
            const allModels = prepareOptions(modelsData, 'id', 'model_name')
            // setModels(allModels)
            setModels((old) => ({ ...old, [ index ]: allModels }));
        }
    };

     // handle add rows
     const addTableRows = () => {

        const rowsInput = {
            model: '',
            brand: '',
        }
        setRowsData([...rowsData, rowsInput])
    
    }

    // handle delete rows
    const deleteTableRows = (index) => {
        if(rowsData.length > 1) {
            const rows = [...rowsData];
            rows.pop();
            setRowsData(rows);
        }
    }

    // fetch on load data
    const fetchOnLoad = async() => {
        const brands = await GetAedBrands();

        if(brands?.status) {
            const brandsData = brands?.data
            const allBrands = prepareOptions(brandsData, 'id', 'AED_brands')
            setBrands(allBrands);
            // setBrands((old) => ({ ...old, [ 0 ]: allBrands }));
        }

    }

    // get brands by id
    const getBrandById = (id) => {
        const brand = brands.find(
            brand => brand.value === id
        )
        return brand;

    }

    // get model by id
    const getModelById = (id) => {
        const model = models.find(
            model => model.value === id
        )
        return model;

    }
    
    useEffect(() => {
        fetchOnLoad();
        if(typeof aedData === 'string'){
            let dd = JSON.parse(aedData);
        if (dd != null && dd?.length > 0 && mode != 'new') {
                setRowsData(dd);
            } else if(dd != null && dd?.length > 0) {
                setRowsData(dd);
            }
        }else{
        if (aedData != null && aedData?.length > 0 && mode != 'new') {
                setRowsData(aedData);
            } else if(aedData != null && aedData?.length > 0) {
                setRowsData(aedData);
            }
        }

    }, [aedData])

    return (
        <>
        <div className="d-flex align-items-center AEDMargin">
            <h2 className="heading">AED Information</h2>
            <div className="d-flex align-items-center ms-3">
                <button type="button" className="btn py-1 btn-sm mx-2 btn-primary" onClick={addTableRows}>+</button>
                <button type="button" className="btn py-1 btn-sm mx-2 btn-danger" onClick={deleteTableRows}>-</button>
            </div>
        </div>
        {rowsData.map((row, index) => (
            <div className="row mb-3" key={index}>
                <Form.Group className={ "col-3" } style={{minWidth:"200px"}}>
                    <Form.Label>Brand</Form.Label>
                    <Select
                        value={rowsData[index]?.brand}
                        options={ brands }
                        onChange={ (value) => { handleSelectChange(index, value, 'brand'); fetchModelsByBrand(index, value); } }
                        menuPosition={'fixed'} 
                    />
                </Form.Group>

                <Form.Group className={ "col-3" } style={{minWidth:"200px"}}>
                    <Form.Label>Model</Form.Label>
                    <Select
                        value={rowsData[index]?.model}
                        options={ models[index] }
                        onChange={ (value) => handleSelectChange(index, value, 'model') }
                        menuPosition={'fixed'} 
                    />
                </Form.Group>
            </div>
        ))}
        </>
    )
}
