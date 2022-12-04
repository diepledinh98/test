

import { Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { Key, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import ISelect from '@core/select';
import RightMenu, { IArrayAction } from '@layout/RightMenu';
import CircleLabel from '@shared/components/CircleLabel';
import { DeleteConfirm } from '@shared/components/ConfirmDelete';
import MainTitleComponent from '@shared/components/MainTitleComponent';
import SelectAndLabelComponent, {
    ISelectAndLabel,
} from '@shared/components/SelectAndLabelComponent';
import TableComponent from '@shared/components/TableComponent';
import useTable from '@shared/components/TableComponent/hook';
import { useAltaIntl } from '@shared/hook/useTranslate';

import { Input, Select, Pagination } from 'antd';
// import { IModal } from '../Homepage/interface';
import { routerViewSetting } from '../../router';
import { useAppDispatch, useAppSelector } from '@shared/hook/reduxhook';
import { getAccount } from '@modules/account/respository';
import { accountStore } from '@modules/account/accoutStore';
import { fetchAccounts } from '@modules/account/accoutStore';
import { IconAddDevice } from '@shared/components/iconsComponent';
const { Search } = Input;
const { Option, OptGroup } = Select;
interface dataAccount {
    id?: string
    email: string
    username: string
    phone: string
    role: string
    status: boolean

}
const AccountManager = () => {
    const { formatMessage } = useAltaIntl();
    const table = useTable();
    const [search, setSearch] = useState<string>('');
    const [filter, setFilterOption] = useState<any>();
    const [roleName, setRoleName] = useState<string>('All')
    const navigate = useNavigate();
    const idChooses = 'id'; //get your id here. Ex: accountId, userId,...

    const dispatch = useAppDispatch();
    const accounts: Array<any> | undefined = useAppSelector((state) => state.account.accounts);
    const roles: Array<any> | undefined = useAppSelector((state) => state.role.roles);
    let data: dataAccount[] | any;
    useEffect(() => {
        dispatch(fetchAccounts())
    }, [dispatch]);

    const onUpdate = (id: string) => {
        navigate(`/updateaccount/${id}`)
    }
    data = accounts.map((account) => {
        return {
            id: account.id,
            email: account.email,
            username: account.username,
            role: account.role.name,
            status: account.status,
            phone: account.phone
        }
    })
    const columns: ColumnsType = [
        {
            title: 'common.history.username',
            dataIndex: 'email',
            align: 'left'
        },
        {
            title: 'common.hoten',
            className: 'column-money',
            dataIndex: 'username',
        },
        {
            title: 'common.phone',
            className: 'column-money',
            dataIndex: 'phone',
            align: 'left',
        },
        {
            title: 'common.e',
            dataIndex: 'email',
        },
        {
            title: 'common.role',
            dataIndex: 'role',
        },
        {
            title: 'common.status',
            dataIndex: '    ',
            render: (status: string) => (
                <>
                    {status ? <CircleLabel text={formatMessage('common.statusActive')} colorCode="green" /> :
                        <CircleLabel text={formatMessage('common.statusNotActive')} colorCode="red" />
                    }
                </>
            )
        },


        {
            title: 'common.update',
            align: 'center',
            render: (action: any, record: any) => {
                return (
                    <>
                        <a
                            onClick={() => onUpdate(record.id)}
                            style={{ textDecoration: "underline", color: "#4277FF", }}
                        >{formatMessage('common.update')}</a>
                    </>

                )
            }
        }
    ];


    const linkAddAccount = () => {
        navigate('/addaccount');
    }

    const handleRole = (value: string) => {
        setRoleName(value)
    }
    const handleSearch = (value: string) => {
        setSearch(value);
    };
    const resolve = (search: string, roleName: string) => {
        return data.filter((item) => {
            if (roleName === 'All') {
                return item?.phone?.toLowerCase()?.includes(search.toLocaleLowerCase()) || item?.username?.toLowerCase()?.includes(search.toLocaleLowerCase())
            }
            if (roleName === item.role) {
                return item?.phone?.toLowerCase()?.includes(search.toLocaleLowerCase()) || item?.username?.toLowerCase()?.includes(search.toLocaleLowerCase()) || item.role === roleName
            }

        })
    }
    const [current, setCurrent] = useState(1)
    //pagination 
    const pageSize = 10
    const getData = (current: any, pageSize: any) => {
        return resolve(search, roleName)?.slice((current - 1) * pageSize, current * pageSize)
    }


    return (
        <div className="service__page">
            <MainTitleComponent breadcrumbs={routerViewSetting} />
            <div className="main-card" style={{ background: 'none', marginTop: 50 }}>

                <div className="d-flex flex-row justify-content-md-between mb-3 align-items-end">
                    <div className="d-flex flex-row " style={{ gap: 10 }}>
                        <div className='sortt'>
                            <label>{formatMessage('common.role.namerole')}</label>
                            <Select defaultValue={formatMessage('common.all')} className="margin-select" onChange={handleRole}>
                                <Option value="All">{formatMessage('common.all')}</Option>
                                {roles.map((role, index) => {
                                    return (
                                        <Option value={role.name}>{role.name}</Option>
                                    )
                                })}
                            </Select>
                        </div>
                    </div>
                    <div className="d-flex flex-column ">
                        <div className="label-select">{formatMessage('common.keyword')}</div>
                        <Search placeholder="Nhập Thông tin " onSearch={handleSearch} />
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
                            dataSource={getData(current, pageSize)}
                            bordered
                            disableFirstCallApi={true}
                            pagination={false}
                        />
                        <Pagination
                            total={data?.length}
                            current={current}
                            onChange={setCurrent}
                            pageSize={pageSize}
                        />
                    </div>
                    <div className='btn_add_device' onClick={linkAddAccount}>
                        <IconAddDevice />
                        {formatMessage('common.addaccount')}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AccountManager;
