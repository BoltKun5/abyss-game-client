export const map = {
    id: MapEnum.LAND_1,
    name: 'Première map',
    teamCount: 2,
    tiles: [
      {
        id: 'ID1',
        posX: 0,
        posY: 0,
        transparent: true,
        walkable: true,
      },
    ],
    startTiles: [
      ['ID1', 'ID2'],
      ['ID3', 'ID4'],
    ],
  };