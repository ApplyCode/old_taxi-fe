import {Toast} from 'native-base';
export async function showToast(text = '', type = 'danger', position = 'bottom') {
    Toast.show({
        text: text == '' ? 'Network Error!' : text,
        type: type,
        textStyle: {textAlign: 'center'},
        position: position,
        duration: 4000,
    }); 
}

