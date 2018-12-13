<!DOCTYPE html>
<html>
  <head>
    <title>Output</title>
  </head>

  <body>

    <?php

    $result_str = file_get_contents("../output.json");
    $json_arr = json_decode($return_str, true);

    ?>
    <table>
      <thead>
        <tr>
          <td>difficulty</td>
          <td>competitors</td>
          <td>installs</td>
          <td>rating</td>
          <td>score</td>
          <td>age</td>
          <td>traffic</td>
          <td>insdtalls</td>
          <td>length</td>
        </tr>
      </thead>

      <tbody>
        <?php
        ?>
        <?php
          foreach ($json_arr as $key => $value) {
            ?>
            <tr>
              <td><?php echo $value; ?></td>
            </tr>
            <?php
          }

        ?>
      </tbody>
    </table>

  </body>
</html>