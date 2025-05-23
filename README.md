# Genshin Helper
A Chrome extension that comes handy while playing Genshin Impact. This extension is not affiliated with HoYoverse.
#### README languages
English | [한국어](https://github.com/jwdjk392/genshin-helper/blob/main/README.ko.md)
## Features
- Auto check in
- See resin stat
- Redeem codes
## Hey! Is this safe to use? Wouldn't this get my account hacked?
> Absolutely safe. We do not collect or save your sensitive information. Everything is processed inside your browser and sent nowhere except ```*.hoyolab.com``` and ```hoyoverse.com```
### How it works:
1. The extension declares access permission to ```*.hoyolab.com``` in its manifest file.
2. When the extension makes a request to Hoyolab or Hoyoverse APIs, **your browser automatically includes any relevant cookies** associated with those domains (if you're logged in).
3. **We do not read, store, or manipulate your cookies directly.**
4. Curious or cautious? You’re welcome to inspect the source code yourself — especially `background.js` and `popup/popup.js`, which handle all API-related logic.

This extension is fully open-source and transparent.


## License
```GNU GPLv3```
## How to install
### Via web store
Click the link for your browser and then click install.
- Naver Whale Browser: [https://store.whale.naver.com/detail/mfgkhldgnockogpfcmbgejdonnecmkch](https://store.whale.naver.com/detail/mfgkhldgnockogpfcmbgejdonnecmkch)
- Microsoft Edge: [https://microsoftedge.microsoft.com/addons/detail/hpjomipcldlnfgamphalcppkpdfknolc](https://microsoftedge.microsoft.com/addons/detail/hpjomipcldlnfgamphalcppkpdfknolc)
### Manually
This method is compatible with most of chromium based browsers.
1. Download .zip file from latest [release](https://github.com/jwdjk392/genshin-helper/releases).
2. Unzip it to where you like it to be. **Note:** You should not delete this folder after install.
3. Open chrome (or chromium based browser), go to [extension](chrome://extensions), and enable ```Developer Mode```
4. Hit ```Load Unpacked```
5. Select directory you had just unzipped, which contains ```manifest.json``` and many more files.
6. Genshin Helper should be loaded.
7. **Please** do not delete the unzipped directory.
## Uninstalling
1. Uninstall like any other extension.
2. Delete the folder you had unzipped.
## Updating
### Via store
Update your extension via store you installed
### Manually
Uninstall & Reinstall the extension.
## Contributing
Feel free to open pull request, issues.