import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setDelayRenderTimeoutInMilliseconds(120_000);

// phoenix-functions lives at repo-root src/ (linked via scripts/link-phoenix.sh)
Config.overrideWebpackConfig((config) => {
  return {
    ...config,
    resolve: {
      ...config.resolve,
      extensionAlias: {
        '.js': ['.js', '.ts', '.tsx'],
      },
    },
  };
});
