<template>
  <div>
    <h2 ><img :src='require(`/src/assets/questionMark.png`) '
    data-toggle="tooltip" data-placement="right"
    title="Collect Merit Points by:
    • Completing study goals
    • Encouraging other students
    • Accessing college resources
    • and more!"> Merit Level</h2>
    <img :src="require(`../assets/brainBadges/${imgUrl}.png`)"
    height="150px" width="150px">
    <p>Level {{curLevel}}</p>
    <div style="max-width: 200px" class="progress m-auto">
    <div class="progress-bar progress-bar-striped progress-bar-animated"
    role="progressbar" :aria-valuenow="point"
    :style="'width: ' + point / xp[curLevel - 1] * 100 + '%'"
    :aria-valuemin="xp[curLevel - 2] || 25"
    :aria-valuemax="xp[curLevel - 1]"></div>
    </div>
    <p>{{xp[curLevel - 1] - point}} point(s) left to level up!</p>
  </div>
</template>
<script>
// @ is an alias to /src
export default {
  name: 'MeritPoints',
  props: ['points'],
  data: () => ({
    xp: [25, 75, 200, 350, 600],
    curLevel: 1,
    imgUrl: 'BrainBadgeS_1',
    point: 0,
  }),
  components: {
  },
  methods: {
    calculateLevel() {
      // we will take the points and calculate the level
      this.xp.forEach((e) => {
        if (this.point > e) {
          this.curLevel += 1;
        }
      });

      if (this.curLevel > 5) {
        this.curLevel = 5;
        this.point = this.xp[this.curLevel - 1];
      }
      this.setImage();
    },
    setImage() {
      switch (this.curLevel) {
        case 1:
          this.imgUrl = 'BrainBadgeS_1';
          break;
        case 2:
          this.imgUrl = 'BrainBadgeS_2';
          break;
        case 3:
          this.imgUrl = 'BrainBadgeS_3';
          break;
        case 4:
          this.imgUrl = 'BrainBadgeS_4';
          break;
        case 5:
          this.imgUrl = 'BrainBadgeS_5';
          break;
        default:
          this.imgUrl = 'BrainBadgeS_1';
          break;
      }
    },
  },
  mounted() {
    this.point = this.points;
    this.calculateLevel();
  },
};
</script>
