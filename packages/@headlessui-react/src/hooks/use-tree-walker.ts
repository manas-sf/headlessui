import { useEffect, useRef } from 'react'
import { getOwnerDocument } from '../utils/owner'
import { useIsoMorphicEffect } from './use-iso-morphic-effect'

type AcceptNode = (
  node: HTMLElement
) =>
  | typeof NodeFilter.FILTER_ACCEPT
  | typeof NodeFilter.FILTER_SKIP
  | typeof NodeFilter.FILTER_REJECT

export function useTreeWalker(
  enabled: boolean,
  {
    container,
    accept,
    walk,
  }: {
    container: HTMLElement | null
    accept: AcceptNode
    walk(node: HTMLElement): void
  }
) {
  let acceptRef = useRef(accept)
  let walkRef = useRef(walk)

  useEffect(() => {
    acceptRef.current = accept
    walkRef.current = walk
  }, [accept, walk])

  useIsoMorphicEffect(() => {
    if (!container) return
    if (!enabled) return
    let ownerDocument = getOwnerDocument(container)
    if (!ownerDocument) return

    let accept = acceptRef.current
    let walk = walkRef.current

    let acceptNode = Object.assign((node: HTMLElement) => accept(node), { acceptNode: accept })
    let walker = ownerDocument.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, acceptNode)

    while (walker.nextNode()) walk(walker.currentNode as HTMLElement)
  }, [container, enabled, acceptRef, walkRef])
}
