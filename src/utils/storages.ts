export const LocalStore = {
  get(key: string, defaultValue = null) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  },
  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key: string) {
    localStorage.removeItem(key);
  },
  clear() {
    localStorage.clear();
  },
};

interface CookieStoreInterface {
  get(key: string, defaultValue?: any): any;
  set(
    key: string,
    value: any,
    options?: {
      path?: string;
      expires?: Date;
      domain?: string;
      secure?: boolean;
    }
  ): void;
  remove(key: string): void;
  clear(): void;
}

export const CookieStore: CookieStoreInterface = {
  get(key: string, defaultValue = null) {
    const value = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return value ? JSON.parse(value[2]) : defaultValue;
  },
  set(key: string, value: any, options = {}) {
    options = {
      path: "/",
      // add other defaults here if necessary
      ...options,
    };
    if (options.expires instanceof Date) {
      options.expires = options.expires.toUTCString();
    }
    let updatedCookie = encodeURIComponent(key) + "=" + JSON.stringify(value);
    for (let optionKey in options) {
      updatedCookie += "; " + optionKey;
      let optionValue = options[optionKey];
      if (optionValue !== true) {
        updatedCookie += "=" + optionValue;
      }
    }
    document.cookie = updatedCookie;
  },
  remove(key: string) {
    this.set(key, null, { expires: -1 });
  },
  clear() {
    document.cookie.split(";").forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  },
};

export const SessionStore = {
  get(key: string, defaultValue: any = null) {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  },
  set(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value));
  },
  remove(key: string) {
    sessionStorage.removeItem(key);
  },
  clear() {
    sessionStorage.clear();
  },
};
