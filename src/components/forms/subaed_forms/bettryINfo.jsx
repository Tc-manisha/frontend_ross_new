{
    Permissins?.has_battery || all_condition_true ?
    <div className=' bg-gray py-4 px-4 mt-4'>
        <h2 className='heading'>{ "Battery Information" }
            <button onClick={ () => addRemoveChargePakInfo('add', 'spare_battery_info') }
                className="btn mx-2 btn-sm btn-primary "
                type="button"
                disabled={ formData?.no_spares_toggle }
            >
                +
            </button>
        </h2>


        { formData?.battery_info?.map((item, index) => (
            <BatteryInformation
                keyName={ 'battery_info' }
                title="Battery Information"
                crrIndex={ index }
                formData={ formData }
                setFormData={ setFormData }
                handleCheckBox={ handleCheckBox }
                handleInput={ handleInput }
                crrFormData={ item }
                addMore={ addMorebattery_info }
                Permissins={ Permissins }
            />
        )) }

    </div>
    : ""
}


{
    formData?.spare_battery_info.length > 0 || all_condition_true ?
    <div className=' bg-gray py-4 px-4 mt-4'>
        <h2 className='heading'>{ 'Spare Battery Information' }

            <button
                onClick={ addMorespare_battery_info }
                className="btn mx-2 btn-sm btn-primary "
                disabled={ formData?.no_spares_toggle }
                type="button"
            >
                +
            </button>
            <button
                onClick={ Removespare_battery_info }
                className="btn mx-2 btn-sm btn-danger "
                type="button"
            >
                -
            </button>
        </h2>
        { formData?.spare_battery_info?.map((item, index) => (
            <SpareBatteryInformation
                keyName={ 'spare_battery_info' }
                title="Spare Battery Information"
                crrIndex={ index }
                formData={ formData }
                setFormData={ setFormData }
                handleCheckBox={ handleCheckBox }
                handleInput={ handleInput }
                crrFormData={ item }
                addMore={ addMorespare_battery_info }
                RemoveSpare={ () => Removespare_battery_info(index) }
                Permissins={ Permissins }
            />
        )) }
    </div>
    : ""
}