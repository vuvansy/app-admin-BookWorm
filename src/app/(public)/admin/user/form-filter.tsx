'use client'

import type { FormProps } from 'antd';
import { Button, Form, Input } from 'antd';

type FieldType = {
    fullName?: string;
    email?: string;

};

const FilterForm = () => {
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log(values)
    };
    return (
        <Form
            name="form-filter"
            className='w-full flex '
            onFinish={onFinish}
            autoComplete="off"
        >
            <div className='basis-2/3 flex gap-x-[100px] items-center'>
                <Form.Item<FieldType>
                    name="fullName"
                    label="Tên Người Dùng"
                    className='w-[400px] text-body1'

                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    name="email"
                    label="Email"
                    className='w-[350px] text-body1'

                >
                    <Input />
                </Form.Item>
            </div>
            <div className='basis-1/3 flex justify-end gap-x-[15px]'>
                <Button type="default" className=''>Đặt lại</Button>
                <Button type="primary" htmlType="submit" className=''>Tìm kiếm</Button>
            </div>


        </Form>
    )
}
export default FilterForm;