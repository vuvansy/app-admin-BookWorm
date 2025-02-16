import { Spin } from 'antd';

export default function Loading() {
    return (
        <div className="fixed h-screen w-full inset-0 flex justify-center items-center bg-opacity-30 z-50">
            <Spin size="large" />
        </div>
    );
}