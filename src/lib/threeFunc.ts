import { ImageCacheData } from "@/types/api";
import * as THREE from 'three';
import SpriteText from 'three-spritetext';
import { ForceGraphMethods } from 'react-force-graph-3d'

export const createThreeObject = (node: any | undefined, currentCache: ImageCacheData[], fgRef: React.MutableRefObject<ForceGraphMethods<{}, {}> | undefined>) => {
  // OnChain Summer Registry Graph Node
  if (node.depth === 1) {
    //Sphere object 
    const texture = new THREE.TextureLoader().load("/base-sphere-square.png");
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshBasicMaterial({
      map: texture
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.scale.set(10, 10, 10);
    sphere.position.set(0, 0, 0);

    // Text Object
    const text = new SpriteText(node?.description);
    text.color = "#99CCFF";
    text.textHeight = 3;
    text.fontFace = 'Arial';
    text.position.set(0, -15, 0);

    // Group Object 
    const group = new THREE.Group();
    group.add(sphere);
    group.add(text);

    return group
  }
  // Category Graph node
  if (node.depth === 2) {

    const texture = new THREE.TextureLoader().load(`${node.imageUrl}.svg`);

    // Sprite object
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(8, 8, 8);
    sprite.position.set(0, 0, 0);

    // Sphere object
    const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x87cefa,
      transparent: true,
      opacity: 0.2
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // Text Object
    const text = new SpriteText(node?.description);
    text.color = "#00bfff";
    text.textHeight = 3;
    text.fontFace = 'Arial'; // Font face (though limited, can be set)
    text.position.set(0, -8, 0);

    // Group object
    const group = new THREE.Group();
    group.add(sprite);
    group.add(sphere);
    group.add(text);

    return group
  }
  if (node.depth === 3) {
    console.log("base64str is :");
    // Dapp logo texture 
    const base64str = deriveBase64DataFromCache(node,currentCache);
    console.log("base64str is :", base64str)
    const texture = new THREE.TextureLoader().load(base64str)
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
    sprite.position.set(0, 0, 0);

    // Sphere object
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff, // red color
      transparent: true,
      opacity: 0.1 // 50% opacity
    });
    const sphere = new THREE.Mesh(geometry, sphereMaterial);
    sphere.scale.set(4, 4, 4);
    sphere.position.set(0, 0, 0);


    // Text object
    const text = new SpriteText(String(node?.id));
    text.color = "#d3d3d3";
    text.textHeight = 2;
    text.fontFace = 'Arial'; // Font face (though limited, can be set)
    text.position.set(0, -4, 0);

    // Group object
    const group = new THREE.Group();
    group.add(sprite);
    group.add(text);

    return group
  }
}


const isURL = (str: string) => {
  // Regular expression to match URLs starting with http:// or https://
  const urlRegex = /^(?:https?:\/\/)?[\w.-]+\.\w{2,}(?:\/.*)?$/;
  return urlRegex.test(str);
}

const deriveBase64DataFromCache = (node: any | undefined, currentCache: ImageCacheData[]) : string => {
  return currentCache.filter((obj: { imageUrl: string }) => {
    const pathname = isURL(obj?.imageUrl) ? new URL(obj?.imageUrl).pathname : obj?.imageUrl;
    return pathname === node.imageUrl
  })[0].base64data;
}

export const createNodeHoverObject = (node: any | undefined, fgRef: React.MutableRefObject<ForceGraphMethods<{}, {}> | undefined>) => {
  // Scene Object
  const scene = fgRef.current?.scene();

  const geometry = new THREE.SphereGeometry(1, 64, 64);
  const material = new THREE.MeshBasicMaterial({
  });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.scale.set(10, 10, 10);
  sphere.position.set(node?.x, node?.y, node?.z);
  scene?.add(sphere);
}

export const appNodeClick = (node: any) => window.open(node.url);


export const appCard = (node: any, currentCache: ImageCacheData[] ) => {
  return `<div className="flex items-center justify-center min-h-screen">
    <div className="min-h-32 flex w-full max-w-[1440px] flex-col gap-10 px-8 pb-32">
      <div className="flex flex-col gap-10 lg:grid lg:grid-cols-4">
    <a
    href=${node?.url}
    rel="noreferrer noopener"
    target="_blank"
    className="flex w-full flex-col justify-start gap-8 bg-gray p-8 visited:opacity-50 hover:bg-darkgray"
  >
    <div className="flex flex-row justify-between">
      <div className="relative h-[80px] w-[80px] overflow-hidden rounded-[3px]">
        <Image width="50" height="50" src=${deriveBase64DataFromCache(node, currentCache)} fill style={{ objectFit: 'contain' }} alt=Logo of ${node?.id} />
      </div>
    </div>
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <h3 className="font-mono text-xl uppercase text-white">${node?.id}</h3>
        <span className="muted truncate font-mono text-muted">
          ${getNiceDomainDisplayFromUrl(node?.url)}
        </span>
      </div>
      <p className="ecosystem-card-description font-sans text-base text-white">
       ${node?.description}
      </p>
    </div>
  </a>
  </div>
  </div>
</div>`};

function getNiceDomainDisplayFromUrl(url: string) {
  return url.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0];
}