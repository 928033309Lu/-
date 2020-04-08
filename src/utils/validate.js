// { min: 11, max: 11, message: '请正确输入手机号码', trigger: 'blur' }
// rules: {
//     email: [
//         {required: true, message: '请输入邮箱', trigger: 'blur'},
//         {validator: validateEmail, trigger: ['blur', 'change']}
//     ],
// }
export const validateTurbineName = (rule, value, callback) => {
    if (value === '' || value === null) {
        callback(new Error('请输入编号'))
    } 
    // else if (!/^[A-Za-z0-9-]{1,10}$/.test(value)) {
    //     callback(new Error('请正确输入编号'))
    // }
    // else if (!/^[\w.-]{1,10}$/.test(value)) {
    //     callback(new Error('允许输入数字、字母、中划线、字符不超10'))
    // }
     else {
        callback()
    }
}
// WGS84投影坐标X
export const validateWGS84X = (rule, value, callback) => {
    if (value === '' || value === null) {
        callback(new Error('请输入投影坐标X'))
    }
    // else if (!/^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,4})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/.test(value)) {
    //     callback(new Error('X为-180-180，允许输入到小数点后四位'))
    // } 
    else if (!/^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,8})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,8}|180)$/.test(value)) {
        callback(new Error('X为-180-180，允许输入到小数点后八位'))
    } 
    else {
        callback();
    }
}
// WGS84投影坐标Y
export const validateWGS84Y = (rule, value, callback) => {
    if (value === '' || value === null) {
        callback(new Error('请输入投影坐标Y'))
    }
    //  else if (!/^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,4})?)|90(([.][0]{1,4})?))$/.test(value)) {
    //     callback(new Error('Y为-90-90，允许输入到小数点后四位'))
    // }
     else if (!/^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,8})?)|90(([.][0]{1,8})?))$/.test(value)) {
        callback(new Error('Y为-90-90，允许输入到小数点后八位'))
    }
     else {
        callback()
    }
}
// 6位数坐标验证
export const valUTMX = (rule, value, callback) => {
    if (value === '' || value === null) { 
        callback(new Error('请输入投影坐标X'))
    } 
    // else if (!/^[\d]{6}(\.\d{1,4})?$/.test(value)) {                     
    //     callback(new Error('X为6位正数，允许输入到小数点后四位'))
    // } 
    else if (!/^[\d]{6}(\.\d{1,8})?$/.test(value)) {                     
        callback(new Error('X为6位正数，允许输入到小数点后八位'))
    } 
    else {
        callback()
    }
}
// 其他投影坐标X
export const validateCoordinateX = (rule, value, callback) => {
    if (value === '' || value === null) { 
        callback(new Error('请输入投影坐标X'))
    } 
    // else if (!/^[\d]{8}(\.\d{1,4})?$/.test(value)) {                     
    //     callback(new Error('X为8位正数，允许输入到小数点后四位'))
    // } 
    else if (!/^[\d]{8}(\.\d{1,8})?$/.test(value)) {                     
        callback(new Error('X为8位正数，允许输入到小数点后八位'))
    } 
    else {
        callback()
    }
}
// 其他投影坐标Y
export const validateCoordinateY = (rule, value, callback) => {
    if (value === '' || value === null) {
        callback(new Error('请输入投影坐标Y'))
    } 
    // else if (!/^[\d]{7}(\.\d{1,4})?$/.test(value)) {
    //     callback(new Error('Y为7位正数，允许输入到小数点后四位'))
    // } 
    else if (!/^[\d]{7}(\.\d{1,8})?$/.test(value)) {
        callback(new Error('Y为7位正数，允许输入到小数点后八位'))
    } 
    else {
        callback()
    }
}

// 机型
export const validateType = (rule, value, callback) => {
    let arr = value.split('/')
    if (value === '' || value === null) {
        callback(new Error('请输入机型'))
    } else if (arr.length != 2 || arr.length <= 1 ) {
        callback(new Error('请正确输入机型'))
    } else {
        callback()
    }
}
// 状态
export const validateStatues = (rule, value, callback) => {
    if (value === '' || value === null) {
        callback(new Error('请输入状态'))
    } else {
        callback()
    }
}
// 字母，数字
export const validateAzNumber = (rule, value, callback) => {
    if (value === '' || value === null) {
        callback(new Error('请输入'))
    } else if (!/^[0-9a-zA-Z]+$/.test(value)) {
        callback(new Error('允许输入字母和数字'))
    }
    else {
        callback()
    }
}

