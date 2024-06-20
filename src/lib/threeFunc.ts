import { ImageCacheData } from "@/types/api";
import * as THREE from 'three';
import SpriteText from "three-spritetext";

export const createThreeObject = (node: any |undefined, currentCache: ImageCacheData[] ) => {
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
        const base64str = currentCache.filter((obj: { imageUrl: string }) => {
            const pathname = isURL(obj?.imageUrl) ? new URL(obj?.imageUrl).pathname : obj?.imageUrl;
            return pathname === node.imageUrl
        })[0].base64data;
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
