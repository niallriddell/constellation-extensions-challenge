window.dynamicFetchScriptHook = (script) => {
  let emptyScript = document.createElement('script');
  let src = script.src;
  if(src.startsWith('blob')){
    src = src.replace('blob:', '');
  }
  const regex = /^(?:https?:)?(?:\/\/)?[^/]+/;
  src = src.replace(regex, ""); //component orign src= "/chunks/morecomplex.js"

  fetch(`${PCore.getAssetLoader().appStaticUrl}v100/componentlib/component/${PCore.getAssetLoader().ccV2LibId}${src}`, {headers: { Authorization: `Bearer ${PCore.getAssetLoader().b2sJWT}` }})
      .then(response => response.blob())
      .then(blob => {
          script.src = URL.createObjectURL(blob);
          script.onerror = (event) => {
              URL.revokeObjectURL(script.src);
          };
          script.onload = (event) => {
              URL.revokeObjectURL(script.src);
          };
          emptyScript.remove();
          document.head.appendChild(script);
      });
  return emptyScript;
};

window.checkDevTools = () => {
  if (window && window.cosmos && window.cosmos.instances && window.cosmos.instances.length > 1) {
    try {
      const cosmosVersionsMap = {}
      window.cosmos.instances.forEach(cosmosVersion => {
        const { version, mountedConfigs } = cosmosVersion;
        if(version && mountedConfigs){
          if(mountedConfigs.includes("DXComponents")){
            cosmosVersionsMap["pega-cosmos"] = version;
          } else if(cosmosVersionsMap["pega-cosmos"] !== version){
            const pegaCosmosVersion = cosmosVersionsMap["pega-cosmos"].split('.');
            const libCosmosVersion = version.split('.');
            if(!(pegaCosmosVersion[0] === libCosmosVersion[0] && pegaCosmosVersion[1] === libCosmosVersion[1])){
              cosmosVersionsMap["lib-cosmos"] = cosmosVersionsMap["lib-cosmos"] ? cosmosVersionsMap["lib-cosmos"]+", "+version : version;
            }
          }
        }
      });
      if(Object.keys(cosmosVersionsMap).length > 1){
        console.warn(`%c[Warning] : Please update your library's cosmos version: ${cosmosVersionsMap["lib-cosmos"]} to ${cosmosVersionsMap["pega-cosmos"]} `,"font-size:15px; color: orange; border-left: 3px solid;");
      }
    } catch(ex){
      console.log(ex);
    }
  }
}
checkDevTools();
const mismatchMsgInt = setInterval(checkDevTools, 30000);

export const loadable = (importFn, componentName) => {
  return async () => {
    if (!PCore.getComponentsRegistry().lazyMap[componentName]) {
      const component = await importFn();
      PCore.getComponentsRegistry().lazyMap[componentName] = component.default;
    }
  };
};


/* START */
 const ComponentMap = {
	Sl_DXExtensions_StarRatingWidget: {
	 modules: [
		 loadable (() =>
			 import(
				/* webpackChunkName: 'Sl_DXExtensions_StarRatingWidget' */
				 '/Users/riddn/work/constellation-extensions-challenge/src/components/Sl_DXExtensions_StarRatingWidget/index.tsx'
				)
			, 'Sl_DXExtensions_StarRatingWidget')
		]
	}
};
/* END */

PCore.getComponentsRegistry().mergeComponentsMap(ComponentMap);