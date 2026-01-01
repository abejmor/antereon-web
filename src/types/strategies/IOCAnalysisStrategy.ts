export interface IOCAnalysisStrategy {
  readonly provider: string;

  analyzeIP(_ip: string): Promise<IOCAnalysisResult>;
  analyzeDomain(_domain: string): Promise<IOCAnalysisResult>;
  analyzeHash(_hash: string): Promise<IOCAnalysisResult>;
  analyzeUrl(_url: string): Promise<IOCAnalysisResult>;
}

export interface IOCAnalysisResult {
  id?: string;
  provider: string;
  iocValue: string;
  iocType: 'ip' | 'domain' | 'hash' | 'url';
  data: Record<string, unknown>;
  error?: string;
  analysisTimestamp?: string;
}
