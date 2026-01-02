import type { IOCAnalysisResult } from '@/types/strategies/IOCAnalysisStrategy'

export const useExport = () => {
  const exportIOCResults = (results: IOCAnalysisResult[], filename?: string) => {
    if (results.length === 0) {
      return
    }

    const headers = ['IOC', 'Type', 'Provider', 'Analysis Date']

    const csvContent = [
      headers.join(';'),
      ...results.map((result) =>
        [
          result.iocValue,
          result.iocType,
          result.provider,
          result.analysisTimestamp
            ? new Date(result.analysisTimestamp).toLocaleDateString()
            : 'N/A'
        ].join(';')
      )
    ].join('\n')

    const defaultFilename = `ioc-analysis-${new Date().toISOString().split('T')[0]}.csv`
    downloadCSV(csvContent, filename || defaultFilename)
  }

  const exportIOCResultsByProvider = (
    results: IOCAnalysisResult[],
    provider: string,
    filename?: string
  ) => {
    const filteredResults = results.filter((result) => result.provider === provider)
    const defaultFilename = `ioc-analysis-${provider}-${new Date().toISOString().split('T')[0]}.csv`
    exportIOCResults(filteredResults, filename || defaultFilename)
  }

  const exportToJSON = (data: Record<string, unknown>, filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
    downloadFile(blob, filename)
  }

  const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    downloadFile(blob, filename)
  }

  const downloadFile = (blob: Blob, filename: string) => {
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }

  return {
    exportIOCResults,
    exportIOCResultsByProvider,
    exportToJSON
  }
}
