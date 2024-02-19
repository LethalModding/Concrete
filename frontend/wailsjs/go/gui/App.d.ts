// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {types} from '../models';
import {steam} from '../models';
import {options} from '../models';
import {gui} from '../models';

export function BrowseDirectory(arg1:string):Promise<string>;

export function GetConfig():Promise<types.Config>;

export function GetConfigValue(arg1:string):Promise<string>;

export function GetSteam():Promise<steam.Steam>;

export function GetTSMod(arg1:string):Promise<string>;

export function OnSecondInstanceLaunch(arg1:options.SecondInstanceData):Promise<void>;

export function SetConfigValue(arg1:string,arg2:string):Promise<void>;

export function StdLogger():Promise<gui.LogxiStdLogger>;
