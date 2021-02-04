<script lang="ts">
  import type { UserInfo } from '../types/Api';

  export let user: UserInfo;
</script>

<div>
  <div>
    <div>{user.name}</div>
  </div>
</div>
