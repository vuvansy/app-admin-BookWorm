import queryString from 'query-string';

export const sendRequestJS = async (props) => {
    let {
        url,
        method,
        body,
        queryParams = {}, // = thể hiện gắn mặc định trường hợp k truyền. Trường hợp k truyền thì là 1 object rỗng
        useCredentials = false,
        headers = {},
        nextOption = {}
    } = props;

    const options = {
        method: method, //Gán method
        // by default setting the content-type to be json type
        headers: new Headers({ 'content-type': 'application/json', ...headers }), //Mặc định và + headers truyền vào
        body: body ? JSON.stringify(body) : null, //Sau này chỉ cần truyền 1 biến object
        ...nextOption
    };

    if (useCredentials) options.credentials = "include"; //Giúp gửi cookie từ cline lên server(có khả năng đọc được cookie đấy)

    if (queryParams) { //Tham số trên URL ví dụ như phân trang 
        url = `${url}?${queryString.stringify(queryParams)}`;
    }

    return fetch(url, options).then(res => {
        if (res.ok) {
            return res.json(); //Kết quả
        } else {
            return res.json().then(function (json) {
                // to be able to access error status when you catch the error 
                return {
                    statusCode: res.status,
                    message: json?.message ?? "",
                    error: json?.error ?? ""
                };
            });
        }
    });
};