'use client'

import { App, Modal, Table } from "antd";
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Upload } from 'antd';
import { useState } from "react";
import Exceljs from 'exceljs';
import { Buffer } from 'buffer';
const { Dragger } = Upload;


interface IProps {
    openModalImport: boolean;
    setOpenModalImport: (v: boolean) => void;
    onUserAdded?: () => void;
}


interface IDataImport {
    fullName: string;
    email: string;
    phone: string;
}

const ImportUser = (props: IProps) => {
    const { setOpenModalImport, openModalImport, onUserAdded } = props;
    const templateFileUrl = "/template/user_bookworm.xlsx";


    const { message, notification } = App.useApp();
    const [dataImport, setDataImport] = useState<IDataImport[]>([]);

    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const propsUpload: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,

        // https://stackoverflow.com/questions/11832930/html-input-file-accept-attribute-file-type-csv
        accept: ".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

        // https://stackoverflow.com/questions/51514757/action-function-is-required-with-antd-upload-control-but-i-dont-need-it
        customRequest({ file, onSuccess }) {
            setTimeout(() => {
                if (onSuccess) onSuccess("ok");
            }, 1000);
        },

        async onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                console.log(info)
                message.success(`${info.file.name} file uploaded successfully.`);
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj!;

                    //load file to buffer (logic đọc file)
                    const workbook = new Exceljs.Workbook();
                    const arrayBuffer = await file.arrayBuffer()
                    const buffer = Buffer.from(arrayBuffer);
                    await workbook.xlsx.load(buffer);

                    //convert file to json
                    let jsonData: IDataImport[] = [];
                    workbook.worksheets.forEach(function (sheet) {
                        // read first row as data keys
                        let firstRow = sheet.getRow(1); //Key table
                        if (!firstRow.cellCount) return;

                        let keys = firstRow.values as any[];

                        sheet.eachRow((row, rowNumber) => {
                            if (rowNumber == 1) return;
                            let values = row.values as any;
                            let obj: any = {};
                            for (let i = 1; i < keys.length; i++) {
                                obj[keys[i]] = values[i];
                            }
                            jsonData.push(obj);
                        })

                    });

                    jsonData = jsonData.map((item, index) => {
                        return { ...item, id: index + 1 }
                    })

                    setDataImport(jsonData)

                }

            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const handleImport = async () => {
        setIsSubmit(true);

        const dataSubmit = dataImport.map(item => ({
            fullName: item.fullName,
            email: item.email,
            phone: item.phone,
            password: process.env.NEXT_PUBLIC_USER_CREATE_DEFAULT_PASSWORD
        }));

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/user-many`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataSubmit)
            });

            const data: IBackendRes<IResponseImport> = await res.json();

            if (!res.ok) {
                notification.error({
                    message: "Tạo người dùng hàng loạt không thành công",
                    description: `Success = ${data?.data?.countSuccess || 0}. Error = ${data?.data?.countError || 0}`
                });
                return;
            }

            notification.success({
                message: "Tạo người dùng hàng loạt thành công",
                description: `Success = ${data?.data?.countSuccess || 0}. Error = ${data?.data?.countError || 0}`
            });
            if (onUserAdded) {
                onUserAdded();
            }

            setDataImport([]);
            setOpenModalImport(false);
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
            notification.error({
                message: "Bulk Create Users Failed",
                description: "Không thể kết nối tới server!"
            });
        } finally {
            setIsSubmit(false);
        }
    };

    return (
        <>
            <Modal title="Import data user"
                width={"50vw"}
                open={openModalImport}
                onOk={() => handleImport()}
                onCancel={() => {
                    setOpenModalImport(false);
                    setDataImport([]);
                }}
                okText="Import data"
                okButtonProps={{
                    disabled: dataImport.length > 0 ? false : true,
                    loading: isSubmit
                }}
                //do not close when click outside
                maskClosable={false}
                destroyOnClose={true}
            >
                <Dragger {...propsUpload} >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single upload. Only accept .csv, .xls, .xlsx . or
                        &nbsp;
                        <a
                            onClick={(e) => e.stopPropagation()}
                            href={templateFileUrl}
                            download
                        >
                            Download Sample File
                        </a>
                    </p>
                </Dragger>
                <div style={{ paddingTop: 20 }}>
                    <Table
                        rowKey={"id"}
                        title={() => <span>Dữ liệu upload:</span>}
                        dataSource={dataImport}
                        columns={[
                            { dataIndex: 'fullName', title: 'Tên hiển thị' },
                            { dataIndex: 'email', title: 'Email' },
                            { dataIndex: 'phone', title: 'Số điện thoại' },
                        ]}
                    />
                </div>
            </Modal>
        </>
    )
}

export default ImportUser;