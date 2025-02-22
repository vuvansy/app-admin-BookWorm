
import { Button} from 'antd';
import {PlusOutlined } from '@ant-design/icons';
import TableBanner from './table-banner';

const BannerPage = () => {
    return (
        <div className="rounded border bg-white p-[15px]">
            <h2 className="text-body-bold uppercase">Danh sách Banner</h2>
            <div className="flex justify-end pb-[20px]">
                <Button icon={<PlusOutlined />} type="primary">Thêm mới</Button>
            </div>
            <TableBanner/>
        </div>
    )
}

export default BannerPage