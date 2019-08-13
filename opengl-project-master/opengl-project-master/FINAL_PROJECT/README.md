컴퓨터 그래픽스 프로젝트 보고서<br></br>
소프트웨어 201420908 하태민<br></br>
<br></br>
Git address : http://git.ajou.ac.kr/Taemin/opengl-project/tree/master/FINAL_PROJECT<br></br>
WebGL Project에서 FINAL_PROJECT directory에 있습니다. <br></br>
<br></br>
과제에서 했던 것들을 위주로 튜토리얼을 제작했습니다. <br></br>
첫 번째로는 translate를 각 x, y, z 좌표를 positive 또는 negative 방향으로 움직이도록 하였습니다. 이 때 한 번 만 움직이고 싶은데 계속해서 움직이는 현상이 발생했습니다. 그래서 flag를 두어서 버튼을 누를 때 1로 만들고 transform은 flag가 1일 때만 바뀌도록 하였습니다. Translation reset 버튼을 두어서 translation 값을 초기화 하는 기능도 넣어봤습니다. <br></br>
두 번째로는 rotate를 z축과 x축에 대해 움직이도록 만들었습니다. Rotate value를 두어서 0.01 증가 시키거나 0.01 감소 시키는 버튼을 구현했습니다. 버튼을 누를 때만 rotate되기 때문에 계속 rotate 되도록 animation rotate 버튼을 만들었습니다. Animation rotate는 flag가 0일 때 트랜스폼이 일어납니다. rotate값은 고정 값으로 두고 animation rotate 값은 계속 0.01이 증가하도록 하였습니다. rotate에서도 버튼을 두어서 rotate값을 초기화 하는 기능을 넣었습니다. Animation rotate value는 초기화되지 않습니다. <br></br>
세 번째로는 scale을 x, y, z 좌표에 대해 scale value만큼 증가하게 했습니다. Scale Up Value 버튼과 Scale Down Value 버튼은 각각 scale value를 0.01배 키우거나 줄이는 버튼입니다. Scale 기능 또한 flag가 1일 때만 바뀌도록 하였습니다. Scale을 translation 이전에도 한 것을 보여주기 위해 Scale Value Before Translate 버튼을 up과 down 두 종류로 만들었습니다. 그림 바로 아래에 moving matrix를 두어서 두 기능에 대한 변화를 확인할 수 있습니다. 또한 scale에서도 Scale value reset 버튼을 두어서 scale 값을 초기화 하는 기능도 넣어봤습니다. <br></br>
네 번째로는 attribute를 point, lines, triangles로 나누는 기능을 만들었습니다. 여기 코드는 과제 예시에 있던 코드를 변형해서 사용 했습니다. Flag를 두어 0이면 삼각형, 1이면 점, 2면 라인을 그리도록 하였습니다. <br></br>
마지막으로는 texture를 입히는 기능을 만들어봤습니다. Texture를 입히는 함수를 만들어서 dress image 버튼을 누르면 texture와 image가 object에 입혀집니다. 
기능에 대한 설명들은 각 버튼들 위에 적었습니다.<br></br>
