export namespace steam {
	
	export class Steam {
	    installPath: string;
	    libraryFolders: string[];
	
	    static createFrom(source: any = {}) {
	        return new Steam(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.installPath = source["installPath"];
	        this.libraryFolders = source["libraryFolders"];
	    }
	}

}

export namespace types {
	
	export class Config {
	    dismissLogin: boolean;
	    libraryPath: string;
	    loopbackServerPort: number;
	    steamPath: string;
	
	    static createFrom(source: any = {}) {
	        return new Config(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.dismissLogin = source["dismissLogin"];
	        this.libraryPath = source["libraryPath"];
	        this.loopbackServerPort = source["loopbackServerPort"];
	        this.steamPath = source["steamPath"];
	    }
	}

}

