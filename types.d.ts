export interface Info {
    name: string;
    description: string;
  }
  
  export interface AttribInfo extends Info {}
  export interface CustomEventInfo extends Info{
    details: CustomEventDetailProperty[]
  }
  export interface CustomEventDetailProperty extends Info{
      type: string
  }
  export interface WCInfo extends Info {
    attributes: AttribInfo[] | undefined;
    customEvents: CustomEventInfo[] | undefined;
  }
  export interface WCSuiteInfo {
    tags: WCInfo[];
  }