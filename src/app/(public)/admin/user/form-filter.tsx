'use client'

import type { FormProps } from 'antd';
import { Button, Form, Input } from 'antd';

type FieldType = {
    fullName?: string;
    email?: string;

};
interface FormFilterProps {
    onFilter: (values: any) => void;
}

const FilterForm: React.FC<FormFilterProps> = ({ onFilter }) => {
    const [form] = Form.useForm();
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log(values)
        onFilter(values);
    };
    const handleReset = () => {
        // Reset all form fields
        form.resetFields();

        // Call onFilter with empty values to reload data
        onFilter({});
    };
    return (
        <div className="px-5 pt-5 bg-white rounded">
            <div className="">
                <Form
                    form={form}
                    name="form-filter"
                    className='w-full flex '
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <div className='basis-2/3 flex gap-x-[100px] items-center'>
                        <Form.Item<FieldType>
                            name="fullName"
                            label="Tên Người Dùng"
                            className='flex-1 text-body1'

                        >
                            <Input />
                        </Form.Item>
                        <Form.Item<FieldType>
                            name="email"
                            label="Email"
                            className='flex-1 text-body1'

                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className='basis-1/3 flex justify-end gap-x-[15px]'>
                        <Button type="default" className='' onClick={handleReset}>Đặt lại</Button>
                        <Button type="primary" htmlType="submit" className=''>Tìm kiếm</Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};
export default FilterForm;