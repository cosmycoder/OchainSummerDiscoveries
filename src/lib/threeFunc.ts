import { ImageCacheData, SvgCacheData } from "@/types/api";
import { svg } from "d3";
import * as THREE from 'three';
import SpriteText from 'three-spritetext';

const HEART_SVG = `<svg id="favorite-heart" data-name="favorite-heart" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 107.39">
                       <defs>
                         <style>.cls-1{fill:#ed1b24;fill-rule:evenodd;}</style>
                       </defs>
                       <title>favorite-heart</title>
                       <path class="cls-1" d="M60.83,17.18c8-8.35,13.62-15.57,26-17C110-2.46,131.27,21.26,119.57,44.61c-3.33,6.65-10.11,14.56-17.61,22.32-8.23,8.52-17.34,16.87-23.72,23.2l-17.4,17.26L46.46,93.55C29.16,76.89,1,55.92,0,29.94-.63,11.74,13.73.08,30.25.29c14.76.2,21,7.54,30.58,16.89Z"/>
                    </svg>`;
const blob = new Blob([HEART_SVG], { type: 'image/svg+xml' });
const heart_blob = URL.createObjectURL(blob)

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

const addOnChainSummerRegistryNode = async (group: THREE.Group, node: any, base3dLogo: any) => {
  const loader = new THREE.TextureLoader();
  const texture = await loader.loadAsync(base3dLogo.imageUrl);
  const sphere = createSphere(10, texture);
  // const text = createText(node.description, "#99CCFF", 3, 0, -15, 0);
  group.add(sphere);
};

const addCategoryNode = async (group: THREE.Group, node: any, currentSvgCache: SvgCacheData[]) => {
  const svgData = deriveSvgDataFromCache(node, currentSvgCache);
  const loader = new THREE.TextureLoader();
  const texture = await loader.loadAsync(svgData);
  const sprite = createSprite(texture, 8);
  const sphere = createTransparentSphere(5, 0x87cefa, 0.2);
  const text = createText(node.description, "#00bfff", 3, 0, -8, 0);

  group.add(sprite, sphere, text);
};

const addDappNode = async (group: THREE.Group, node: any, currentCache: ImageCacheData[]) => {
  const base64str = deriveBase64DataFromCache(node, currentCache);
  const loader = new THREE.TextureLoader();
  const texture = await loader.loadAsync(base64str);
  const sprite = createDappSprite(texture);

  //favorite icon

  const faloader = new THREE.TextureLoader();
  const fatexture = await loader.loadAsync(heart_blob);
  const fasprite = createHeartSprite(fatexture);

  const sphere = createTransparentSphere(2, 0xffffff, 0.15);
  const text = createText(String(node.id), "#d3d3d3", 2, 0, -5, 0);

  // Display Hartmark if localstorage have value.
  localStorage.getItem(node.id) === "true" ? group.add(sprite, text, sphere, fasprite) : group.add(sprite, text, sphere);
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
  const aspectRatio = texture.image.width / texture.image.height;
  sprite.scale.set(aspectRatio * 4, 4, 4);
  return sprite;
};

const createHeartSprite = (texture: THREE.Texture): THREE.Sprite => {
  const material = new THREE.SpriteMaterial({
    map: texture,
    alphaToCoverage: true,
    premultipliedAlpha: true,
    transparent: true,
    alphaTest: 0.7,
    blending: THREE.AdditiveBlending
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(5, 5, 5);
  sprite.position.set(0, 3, 3);
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
<div style="border-radius: 3px; width: 350px; padding: 10px; border: 1px solid #ccc; text-align: center; background-color: rgba(0, 0, 0, 0.8);">
  <div>
    <div>
        <div className="flex flex-row justify-between">
          ${localStorage.getItem(node.id) === "true" ? favoriteIcon() : ""}
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

const favoriteIcon = () => `
<Image
  src="${heart_blob}"
  style="border-radius: 3px; background-color: rgba(255, 255, 255, 0); display: block; margin-right: auto; width: 5%;"
  alt="favorite-heart"
/>
`

