import { Button, Result } from 'antd';
import Link from 'next/link';

export default function NotFound() {
    return (
        <main className='flex items-center justify-center bg-bg-main h-screen'>
            <Result
                status="404"
                title="404"
                subTitle="Rất tiếc, chúng tôi không thể tìm thấy những gì bạn đang tìm kiếm."
                extra={<Button type="primary">
                    <Link href={"/"} >Quay lại trang chủ</Link>
                </Button>}
            />
        </main>
    )
}