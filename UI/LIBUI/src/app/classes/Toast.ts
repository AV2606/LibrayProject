var toast: any;

export function showToast(configuration: any = {}) {
    toast(configuration);
}

export function setToast(toastFunc: any) {
    toast = toastFunc;
}

export async function sleep(timeout:number){
    return setTimeout(() => {
        
    }, timeout);
}