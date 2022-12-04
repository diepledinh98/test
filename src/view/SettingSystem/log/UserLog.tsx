

import { Space, DatePicker, Input, Pagination } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { Key, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import ISelect from '@core/select';
import SelectAndLabelComponent, {
    ISelectAndLabel,
} from '@shared/components/SelectAndLabelComponent';
import TableComponent from '@shared/components/TableComponent';
import useTable from '@shared/components/TableComponent/hook';
import { useAltaIntl } from '@shared/hook/useTranslate';
import { fetchHistorys } from '@modules/history/historyStore';
import { useAppDispatch, useAppSelector } from '@shared/hook/reduxhook';
const { Search } = Input
const { RangePicker } = DatePicker
interface DataType {
    id?: string
    reportNumber?: string
    serviceName?: string
    GrantTime?: string
    status?: string
    powerSupply?: string

}

interface historyProps {
    id?: string
    username: string
    time: string
    IP: string
    action: string
}
const UserLog = () => {
    const { formatMessage } = useAltaIntl();
    const table = useTable();
    let data: historyProps[] | any;

    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
    const [search, setSearch] = useState<string>('');
    const [filter, setFilterOption] = useState<any>();
    const navigate = useNavigate();
    const idChooses = 'id'; //get your id here. Ex: accountId, userId,...

    const dispatch = useAppDispatch()
    const historys = useAppSelector((state) => state.history.historys)
    useEffect(() => {
        dispatch(fetchHistorys())
    }, [dispatch])


    const columns: ColumnsType = [
        {
            title: 'common.history.username',
            dataIndex: 'username',
            align: 'left'
        },
        {
            title: 'common.history.time',
            className: 'column-money',
            dataIndex: 'time',
            align: 'left',
        },
        {
            title: 'common.history.IP',
            dataIndex: 'IP',
        },
        {
            title: 'common.history.action',
            dataIndex: 'action',

        },


    ];


    const handleSearch = (value: string) => {
        setSearch(value);
    };
    const resolve = (search: string) => {
        return historys?.filter((item) => {
            return item?.action?.toLowerCase()?.includes(search.toLocaleLowerCase())
        })
    }
    const [current, setCurrent] = useState(1)
    //pagination 
    const pageSize = 10
    const getData = (current: any, pageSize: any) => {
        return resolve(search)?.slice((current - 1) * pageSize, current * pageSize)
    }
    return (
        <div className="service__page">

            <div className="main-card" style={{ background: 'none', marginTop: 50 }}>

                <div className="d-flex flex-row justify-content-md-between mb-3 align-items-end">
                    <div className="d-flex flex-row " style={{ gap: 10 }}>
                        <div className='select__time'>
                            <p>{formatMessage('common.selecttime')}</p>
                            <Space direction="vertical" className='time'>
                                <RangePicker picker="week" />


                            </Space>

                        </div>
                    </div>
                    <div className="d-flex flex-column ">
                        <div className="label-select">{formatMessage('common.keyword')}</div>
                        <Search placeholder="Nhập Thông tin thao tác" onSearch={handleSearch} />
                    </div>
                </div>
                <div className='d-flex' >
                    <div>

                        <TableComponent
                            // apiServices={}
                            defaultOption={filter}
                            translateFirstKey="homepage"
                            rowKey={res => res[idChooses]}
                            register={table}
                            columns={columns}
                            // onRowSelect={setSelectedRowKeys}
                            dataSource={getData(current, pageSize)?.reverse()}
                            bordered
                            disableFirstCallApi={true}
                            pagination={false}
                        />
                        <Pagination
                            total={historys?.length}
                            current={current}
                            onChange={setCurrent}
                            pageSize={pageSize}
                        />
                    </div>

                </div>
            </div>

        </div>
    );
};

export default UserLog;
