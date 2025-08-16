import React from 'react'
import type { OutputData } from '@editorjs/editorjs'

interface EditorJSRendererProps {
  data: OutputData
  className?: string
}

interface Block {
  type: string
  data: any
}

const EditorJSRenderer: React.FC<EditorJSRendererProps> = ({ data, className = '' }) => {
  const renderBlock = (block: Block, index: number) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <p key={index} className="mb-4 text-gray-700 leading-relaxed">
            {block.data.text}
          </p>
        )
      
      case 'header':
        const level = block.data.level || 3
        const headerClasses = {
          1: 'text-3xl font-bold mb-6 text-gray-900',
          2: 'text-2xl font-bold mb-4 text-gray-900',
          3: 'text-xl font-semibold mb-3 text-gray-900',
          4: 'text-lg font-semibold mb-3 text-gray-800',
          5: 'text-base font-semibold mb-2 text-gray-800',
          6: 'text-sm font-semibold mb-2 text-gray-800'
        }
        
        const className = headerClasses[level as keyof typeof headerClasses] || headerClasses[3]
        
        // Render header berdasarkan level
        if (level === 1) {
          return (
            <h1 key={index} className={className}>
              {block.data.text}
            </h1>
          )
        } else if (level === 2) {
          return (
            <h2 key={index} className={className}>
              {block.data.text}
            </h2>
          )
        } else if (level === 3) {
          return (
            <h3 key={index} className={className}>
              {block.data.text}
            </h3>
          )
        } else if (level === 4) {
          return (
            <h4 key={index} className={className}>
              {block.data.text}
            </h4>
          )
        } else if (level === 5) {
          return (
            <h5 key={index} className={className}>
              {block.data.text}
            </h5>
          )
        } else {
          return (
            <h6 key={index} className={className}>
              {block.data.text}
            </h6>
          )
        }
      
      case 'list':
        const items = block.data.items || []
        
        if (block.data.style === 'ordered') {
          return (
            <ol key={index} className="mb-4 pl-6 list-decimal space-y-1">
              {items.map((item: any, itemIndex: number) => (
                <li key={itemIndex} className="text-gray-700 leading-relaxed">
                  {typeof item === 'string' ? item : item.content || item.text || ''}
                </li>
              ))}
            </ol>
          )
        } else {
          return (
            <ul key={index} className="mb-4 pl-6 list-disc space-y-1">
              {items.map((item: any, itemIndex: number) => (
                <li key={itemIndex} className="text-gray-700 leading-relaxed">
                  {typeof item === 'string' ? item : item.content || item.text || ''}
                </li>
              ))}
            </ul>
          )
        }
      
      case 'checklist':
        const checklistItems = block.data.items || []
        
        return (
          <div key={index} className="mb-4 space-y-2">
            {checklistItems.map((item: any, itemIndex: number) => (
              <div key={itemIndex} className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  checked={item.checked || false}
                  readOnly
                  className="mt-1 h-4 w-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                />
                <span className={`text-gray-700 leading-relaxed ${item.checked ? 'line-through text-gray-500' : ''}`}>
                  {typeof item === 'string' ? item : item.text || item.content || ''}
                </span>
              </div>
            ))}
          </div>
        )
      
      case 'quote':
        return (
          <blockquote key={index} className="mb-4 pl-4 py-2 border-l-4 border-green-500 bg-green-50 italic">
            <p className="text-gray-700 mb-2">"{block.data.text}"</p>
            {block.data.caption && (
              <cite className="text-sm text-gray-600 not-italic">
                — {block.data.caption}
              </cite>
            )}
          </blockquote>
        )
      
      default:
        // Fallback untuk block types yang tidak dikenali
        return (
          <div key={index} className="mb-4 p-3 bg-gray-100 border rounded">
            <p className="text-sm text-gray-600">
              Unsupported block type: {block.type}
            </p>
            <pre className="text-xs text-gray-500 mt-1 overflow-x-auto">
              {JSON.stringify(block.data, null, 2)}
            </pre>
          </div>
        )
    }
  }

  if (!data || !data.blocks) {
    return (
      <div className="text-gray-500 italic">
        Tidak ada konten untuk ditampilkan
      </div>
    )
  }

  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      {data.blocks.map((block, index) => renderBlock(block, index))}
    </div>
  )
}

export default EditorJSRenderer