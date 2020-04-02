import Clipboard from 'clipboard'

export async function clip(text, event,cb) {
  return new Promise((resolve,reject) => {
    event = event || {};
    const clipboard = new Clipboard(event.target, {
      text: () => text
    });
    clipboard.on('success', () => {
      if (cb){
        cb(null,'success',text);
      }
      clipboard.off('error');
      clipboard.off('success');
      clipboard.destroy();
      resolve(text);
    });
    clipboard.on('error', () => {
      if (cb){
        cb(-1,'errno',text);
      }
      clipboard.off('error');
      clipboard.off('success');
      clipboard.destroy();
      reject();
    });
    clipboard.onClick(event)

  });



}
