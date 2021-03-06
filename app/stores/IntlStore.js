import alt from "alt-instance";
import IntlActions from "actions/IntlActions";
import SettingsActions from "actions/SettingsActions";
import counterpart from "counterpart";
var locale_en = require("json-loader!assets/locales/locale-en");
import ls from "common/localStorage";
let ss = new ls("__graphene__");

counterpart.registerTranslations("en", locale_en);
counterpart.setFallbackLocale("en");

import {addLocaleData} from "react-intl";

import localeCodes from "assets/locales";
for (let localeCode of localeCodes) {
    addLocaleData(require(`react-intl/locale-data/${localeCode}`));
}

class IntlStore {
    constructor() {
        this.currentLocale = ss.has("settings_v3")
            ? ss.get("settings_v3").locale
            : this.getDefaultLocale();

        this.locales = ["en"];
        this.localesObject = {en: locale_en};

        this.bindListeners({
            onSwitchLocale: IntlActions.switchLocale,
            onGetLocale: IntlActions.getLocale,
            onClearSettings: SettingsActions.clearSettings
        });
    }

    hasLocale(locale) {
        return this.locales.indexOf(locale) !== -1;
    }

    getCurrentLocale() {
        return this.currentLocale;
    }

    onSwitchLocale({locale, localeData}) {
        switch (locale) {
            case "en":
                counterpart.registerTranslations("en", this.localesObject.en);
                break;

            default:
                counterpart.registerTranslations(locale, localeData);
                break;
        }

        counterpart.setLocale(locale);
        this.currentLocale = locale;
    }

    onGetLocale(locale) {
        if (this.locales.indexOf(locale) === -1) {
            this.locales.push(locale);
        }
    }

    onClearSettings() {
        this.onSwitchLocale({locale: "en"});
    }

    getDefaultLocale() {
        let supportedLocales = [
            "en",
            "cn",
            "fr",
            "ko",
            "de",
            "es",
            "it",
            "tr",
            "ru",
            "ja"
        ];

        let fallbackLocales = {
            uk: "ru",
            be: "ru",
            uz: "ru",
            kz: "ru"
        };

        let defaultLocale = "en";
        let userLanguage = navigator.language || navigator.userLanguage;

        for (let i = 0; i < supportedLocales.length; i++) {
            if (userLanguage.startsWith(supportedLocales[i])) {
                defaultLocale = supportedLocales[i];
                break;
            }
        }

        let fallbackKeys = Object.keys(fallbackLocales);
        for (let i = 0; i < fallbackKeys.length; i++) {
            if (userLanguage.startsWith(fallbackKeys[i])) {
                defaultLocale = fallbackLocales[fallbackKeys[i]];
                break;
            }
        }

        return defaultLocale;
    }
}

export default alt.createStore(IntlStore, "IntlStore");
