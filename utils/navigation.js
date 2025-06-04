// Navigation utilities for research tools
export const toolRoutes = {
  ocr: '/tools/ocr',
  ner: '/tools/ner',
  search: '/tools/search',
  qa: '/tools/qa',
  graph: '/tools/graph',
  timeline: '/tools/timeline',
  citations: '/tools/citations',
  comparison: '/tools/comparison',
  export: '/tools/export'
}

export const navigateToTool = (toolId) => {
  const route = toolRoutes[toolId]
  if (route) {
    window.location.href = route
  } else {
    console.warn(`Route not found for tool: ${toolId}`)
  }
}

export const getToolInfo = (toolId) => {
  const toolsInfo = {
    ocr: {
      name: 'OCR Text Extraction',
      description: 'Extract text from images and PDFs',
      category: 'Text Processing'
    },
    ner: {
      name: 'Named Entity Recognition',
      description: 'Extract structured data from texts',
      category: 'Data Analysis'
    },
    search: {
      name: 'Advanced Search',
      description: 'Semantic search across collections',
      category: 'Search & Discovery'
    },
    qa: {
      name: 'AI Q&A Assistant',
      description: 'Intelligent question answering',
      category: 'AI Assistance'
    },
    graph: {
      name: 'Knowledge Graph',
      description: 'Visualize entity relationships',
      category: 'Visualization'
    },
    timeline: {
      name: 'Timeline Generator',
      description: 'Create chronological timelines',
      category: 'Visualization'
    },
    citations: {
      name: 'Citations & References',
      description: 'Find and verify sources',
      category: 'Research Tools'
    },
    comparison: {
      name: 'Document Comparison',
      description: 'Compare texts and manuscripts',
      category: 'Analysis Tools'
    },
    export: {
      name: 'Export & Reports',
      description: 'Generate comprehensive reports',
      category: 'Export Tools'
    }
  }
  
  return toolsInfo[toolId] || null
}