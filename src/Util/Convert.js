export function convertUpkind(upkind) {
  var str;

  switch (upkind) {
    case '0':
      str = '전체';
      break;
    case '422400':
      str = '고양이';
      break;
    case '417000':
      str = '강아지';
      break;
    default:
      break;
  }
  return str;
}

export function convertSido(sido) {
  var str;
  
  switch (sido) {
    case '6110000':
      str = '서울특별시';
      break;
    case '6260000':
      str = '부산광역시';
      break;
    case '6270000':
      str = '대구광역시';
      break;
    case '6280000':
      str = '인천광역시';
      break;
    case '6290000':
      str = '광주광역시';
      break;
    case '5690000':
      str = '세종특별자치시';
      break;
    case '6300000':
      str = '대전광역시';
      break;
    case '6310000':
      str = '울산광역시';
      break;
    case '6410000':
      str = '경기도';
      break;
    case '6420000':
      str = '강원도';
      break;
    case '6430000':
      str = '충청북도';
      break;
    case '6440000':
      str = '충청남도';
      break;
    case '6450000':
      str = '전라북도';
      break;
    case '6460000':
      str = '전라남도';
      break;
    case '6470000':
      str = '경상북도';
      break;
    case '6480000':
      str = '경상남도';
      break;
    case '6500000':
      str = '제주특별자치도';
      break;
    default:
      break;
  }
  return str;
}