export interface VirusTotalBaseResponse {
  data: {
    type: string
    id: string
    links: {
      self: string
    }
    attributes: Record<string, any>
  }
}

export interface VirusTotalIPResponse extends VirusTotalBaseResponse {
  data: {
    type: 'ip_address'
    id: string
    links: {
      self: string
    }
    attributes: {
      network: string
      country: string
      as_owner: string
      asn: number
      continent: string
      regional_internet_registry: string
      jarm: string
      last_analysis_stats: AnalysisStats
      last_analysis_results: Record<string, EngineResult>
      last_modification_date: number
      reputation: number
      total_votes: VoteStats
      whois: string
      whois_date: number
    }
  }
}

export interface VirusTotalDomainResponse extends VirusTotalBaseResponse {
  data: {
    type: 'domain'
    id: string
    links: {
      self: string
    }
    attributes: {
      categories: Record<string, string>
      creation_date: number
      favicon: {
        dhash: string
        raw_md5: string
      }
      jarm: string
      last_analysis_stats: AnalysisStats
      last_analysis_results: Record<string, EngineResult>
      last_dns_records: DNSRecord[]
      last_dns_records_date: number
      last_https_certificate: Certificate
      last_https_certificate_date: number
      last_modification_date: number
      popularity_ranks: Record<string, PopularityRank>
      registrar: string
      reputation: number
      total_votes: VoteStats
      whois: string
      whois_date: number
    }
  }
}

export interface VirusTotalHashResponse extends VirusTotalBaseResponse {
  data: {
    type: 'file'
    id: string
    links: {
      self: string
    }
    attributes: {
      authentihash: string
      creation_date: number
      first_submission_date: number
      last_analysis_date: number
      last_analysis_stats: AnalysisStats
      last_analysis_results: Record<string, EngineResult>
      last_modification_date: number
      magic: string
      md5: string
      meaningful_name: string
      names: string[]
      reputation: number
      sandbox_verdicts: Record<string, SandboxVerdict>
      sha1: string
      sha256: string
      signature_info: SignatureInfo
      size: number
      ssdeep: string
      tags: string[]
      times_submitted: number
      total_votes: VoteStats
      type_description: string
      type_extension: string
      type_tag: string
      unique_sources: number
      vhash: string
    }
  }
}

export interface VirusTotalUrlResponse extends VirusTotalBaseResponse {
  data: {
    type: 'url'
    id: string
    links: {
      self: string
    }
    attributes: {
      categories: Record<string, string>
      favicon: {
        dhash: string
        raw_md5: string
      }
      first_submission_date: number
      html_meta: Record<string, string[]>
      last_analysis_date: number
      last_analysis_stats: AnalysisStats
      last_analysis_results: Record<string, EngineResult>
      last_final_url: string
      last_http_response_code: number
      last_http_response_content_length: number
      last_http_response_content_sha256: string
      last_http_response_cookies: Record<string, string>
      last_http_response_headers: Record<string, string>
      last_modification_date: number
      outgoing_links: string[]
      redirection_chain: string[]
      reputation: number
      tags: string[]
      times_submitted: number
      title: string
      total_votes: VoteStats
      trackers: Record<string, Tracker[]>
      url: string
    }
  }
}

export interface AnalysisStats {
  harmless: number
  malicious: number
  suspicious: number
  undetected: number
  timeout: number
}

export interface EngineResult {
  category: 'harmless' | 'malicious' | 'suspicious' | 'undetected' | 'timeout'
  engine_name: string
  engine_update: string
  engine_version: string
  method: string
  result: string | null
}

export interface VoteStats {
  harmless: number
  malicious: number
}

export interface DNSRecord {
  type: string
  value: string
  ttl?: number
}

export interface Certificate {
  issuer: {
    C?: string
    CN?: string
    O?: string
    OU?: string
  }
  subject: {
    C?: string
    CN?: string
    O?: string
    OU?: string
  }
  serial_number: string
  thumbprint: string
  thumbprint_sha256: string
  validity: {
    not_after: string
    not_before: string
  }
  version: string
}

export interface PopularityRank {
  rank: number
  timestamp: number
}

export interface SandboxVerdict {
  category: string
  confidence: number
  sandbox_name: string
  malware_classification?: string[]
}

export interface SignatureInfo {
  copyright: string
  description: string
  file_version: string
  internal_name: string
  original_name: string
  product: string
}

export interface Tracker {
  id: string
  timestamp: number
  url: string
}

export interface VirusTotalNormalizedData {
  provider: 'virustotal'
  scanId: string
  permalink: string

  detectionStats: AnalysisStats
  detectionRatio: string
  detectionPercentage: number

  typeSpecificData: {
    network?: {
      asn?: number
      asOwner?: string
      country?: string
      continent?: string
    }

    domain?: {
      registrar?: string
      creationDate?: Date
      categories?: string[]
      popularityRanks?: Record<string, number>
    }

    file?: {
      size?: number
      fileType?: string
      names?: string[]
      signatures?: {
        authentihash?: string
        ssdeep?: string
        vhash?: string
      }
      sandboxVerdicts?: Array<{
        sandbox: string
        verdict: string
        confidence: number
      }>
    }

    url?: {
      finalUrl?: string
      httpResponseCode?: number
      title?: string
      categories?: string[]
      redirectionChain?: string[]
      outgoingLinks?: string[]
    }
  }

  engineResults: Array<{
    engine: string
    version: string
    result: string | null
    category: 'harmless' | 'malicious' | 'suspicious' | 'undetected' | 'timeout'
    lastUpdate: Date
  }>

  metadata: {
    reputation?: number
    votes?: {
      harmless: number
      malicious: number
    }
    tags?: string[]
    lastAnalysisDate?: Date
    firstSubmissionDate?: Date
    timesSubmitted?: number
  }
}

export interface VirusTotalError {
  code: string
  message: string
}

export interface VirusTotalErrorResponse {
  error: VirusTotalError
}

export interface VirusTotalConfig {
  apiKey: string
  baseUrl?: string
  timeout?: number
  retryAttempts?: number
  rateLimitDelay?: number
}

export interface VirusTotalMetrics {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  averageResponseTime: number
  rateLimitHits: number
  lastRequestTime?: Date
}

export type VirusTotalResponse =
  | VirusTotalIPResponse
  | VirusTotalDomainResponse
  | VirusTotalHashResponse
  | VirusTotalUrlResponse

export type VirusTotalApiResponse = VirusTotalResponse | VirusTotalErrorResponse
