/** Shared scene helpers for iso maps. */

export function city(id, label, oi, oj, kids, extra = {}) {
  const pad = 0.35;
  let maxI = 0;
  let maxJ = 0;
  const nodes = kids.map((k) => {
    const n = {
      zone: extra.zone,
      owner: extra.owner,
      classif: k.classif || extra.classif,
      layer: k.layer || extra.layer,
      ...k,
      parent: id,
      i: oi + pad + k.i,
      j: oj + pad + k.j,
    };
    maxI = Math.max(maxI, k.i + k.w);
    maxJ = Math.max(maxJ, k.j + k.d);
    return n;
  });
  nodes.unshift({
    id,
    kind: 'team',
    label,
    i: oi,
    j: oj,
    w: maxI + pad * 2 + 0.2,
    d: maxJ + pad * 2 + 0.2,
    h: 0.22,
    ...extra,
  });
  return nodes;
}

export function via(...pts) {
  return pts.map(([i, j]) => ({ i, j }));
}
