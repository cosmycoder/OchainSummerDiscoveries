import { ImageCacheData, SvgCacheData } from "@/types/api";
import * as THREE from 'three';
import SpriteText from 'three-spritetext';

export const createThreeObject = (
  node: any,
  currentCache: ImageCacheData[],
  currentSvgCache: SvgCacheData[],
  base3dLogo: any
): THREE.Group | undefined => {
  if (!node) return undefined;

  const group = new THREE.Group();

  try {
    switch (node.depth) {
      case 1:
        addOnChainSummerRegistryNode(group, node, base3dLogo);
        break;
      case 2:
        addCategoryNode(group, node, currentSvgCache);
        break;
      case 3:
        addDappNode(group, node, currentCache);
        break;
      default:
        return undefined;
    }
  } catch (error) {
    console.error('Error creating Three.js object:', error);
    return undefined;
  }

  return group;
};

const addOnChainSummerRegistryNode = (group: THREE.Group, node: any, base3dLogo: any) => {
  const texture = new THREE.TextureLoader().load(base3dLogo.imageUrl);
  const sphere = createSphere(10, texture);
  // const text = createText(node.description, "#99CCFF", 3, 0, -15, 0);
  group.add(sphere);
};

const addCategoryNode = (group: THREE.Group, node: any, currentSvgCache: SvgCacheData[]) => {
  const svgData = deriveSvgDataFromCache(node, currentSvgCache);
  const texture = new THREE.TextureLoader().load(svgData);

  const sprite = createSprite(texture, 8);
  const sphere = createTransparentSphere(5, 0x87cefa, 0.2);
  const text = createText(node.description, "#00bfff", 3, 0, -8, 0);

  group.add(sprite, sphere, text);
};

const addDappNode = (group: THREE.Group, node: any, currentCache: ImageCacheData[]) => {
  const base64str = deriveBase64DataFromCache(node, currentCache);
  const texture = new THREE.TextureLoader().load(base64str);

  const sprite = createDappSprite(texture);
  const sphere = createTransparentSphere(2, 0xffffff, 0.15);
  const text = createText(String(node.id), "#d3d3d3", 2, 0, -5, 0);

  group.add(sprite, text, sphere);
};

const createSphere = (scale: number, texture: THREE.Texture): THREE.Mesh => {
  const geometry = new THREE.SphereGeometry(1, 64, 64);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.scale.set(scale, scale, scale);
  return sphere;
};

const createTransparentSphere = (scale: number, color: number, opacity: number): THREE.Mesh => {
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.scale.set(scale, scale, scale);
  return sphere;
};

const createSprite = (texture: THREE.Texture, scale: number): THREE.Sprite => {
  const material = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(scale, scale, scale);
  return sprite;
};

const createDappSprite = (texture: THREE.Texture): THREE.Sprite => {
  const material = new THREE.SpriteMaterial({
    map: texture,
    alphaToCoverage: true,
    premultipliedAlpha: true,
    transparent: true,
    alphaTest: 0.5,
    blending: THREE.AdditiveBlending
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(4, 4, 4);
  return sprite;
};

const createText = (
  text: string | undefined,
  color: string,
  height: number,
  x: number,
  y: number,
  z: number
): SpriteText => {
  const spriteText = new SpriteText(text);
  spriteText.color = color;
  spriteText.textHeight = height;
  spriteText.fontFace = 'Arial';
  spriteText.position.set(x, y, z);
  return spriteText;
};

export const deriveBase64DataFromCache = (node: any | undefined, currentCache: ImageCacheData[]): string => {
  const cachedItem = currentCache.find((obj: { imageUrl: string }) => {
    const pathname = isURL(obj.imageUrl) ? new URL(obj.imageUrl).pathname : obj.imageUrl;
    return pathname === node?.imageUrl;
  });

  return cachedItem?.base64data || '';
}

const deriveSvgDataFromCache = (node: any | undefined, currentSvgCache: SvgCacheData[]): string => {
  const cachedItem = currentSvgCache.find((obj: { imageUrl: string }) => {
    const pathname = isURL(obj.imageUrl) ? new URL(obj.imageUrl).pathname : obj.imageUrl;
    return pathname === node?.imageUrl;
  });
  return cachedItem?.svgData || '';
}

export const appNodeClick = (node: any) => window.open(node.url);


const isURL = (str: string) => /^(?:https?:\/\/)?[\w.-]+\.\w{2,}(?:\/.*)?$/.test(str);

export const getNiceDomainDisplayFromUrl = (url: string) =>
  url.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0];

export const appCard = (node: any, currentCache: ImageCacheData[]) => `
<div style="border-radius: 3px; width: 400px; padding: 10px; border: 1px solid #ccc; text-align: center; background-color: rgba(0, 0, 0, 0.8);">
  <div>
    <div>
        <div className="flex flex-row justify-between">
          <div style="text-align: center; display: block;">
            <Image
              src="${deriveBase64DataFromCache(node, currentCache)}"
              style="border-radius: 3px; background-color: rgba(255, 255, 255, 0.3); display: block; margin-left: auto; margin-right: auto; width: 15%;"
              alt="Logo of ${node?.id}"
            />
          </div>
        </div>
        <div>
          <div>
            <h3>${node?.id}</h3>
            <span>${getNiceDomainDisplayFromUrl(node?.url)}</span>
          </div>
          <p>${node?.description}</p>
        </div>
    </div>
  </div>
</div>
`;

